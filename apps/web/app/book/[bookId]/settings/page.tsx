"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getBookMembers } from "./actions/members";
import { getEmails, getInvitations } from "./actions/invitations";
import { toast } from "sonner";
import { Roles } from "@my-ledger/db/schema";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import EditBook from "./components/edit-book";
import DeleteBook from "./components/delete-book";
import TransferBook from "./components/transfer-book";
import MemberList from "./components/member";
import LoaderCircle from "../../../components/loader";
import InvitationList from "./components/invites";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AddOrInviteUser, { type UserDetails } from "./components/addOrInviteUser";
import UploadTransactionFile from "../components/upload-transaction-file";
import { useHasPermission } from "../../../lib";
import { Share2Icon } from "lucide-react";
import { createInviteLink } from "../../../invite/[token]/actions/invite";
import CategoryManager from "./components/category-manager";
import PaymentMethodManager from "./components/payment-method-manager";
import { useRolesContext } from "../../../context";

export type Member = {
  userId: number;
  email: string;
  name: string;
  role: Roles;
};

export type Invitation = {
  id: number;
  bookId: number;
  invitedBy: number;
  email: string;
  role: string;
  accepted: boolean;
  createdAt: string;
  updatedAt: string;
};

export default function BookInfo() {
  const router = useRouter();
  const params = useParams();
  const bookId = params.bookId as string;
  const { roles: books, loading: bookLoading, refetchRoles } = useRolesContext();
  const [membersLoading, setMembersLoading] = useState(true);
  const [invitationsLoading, setInvitationsLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [refetchMembers, setRefetchMembers] = useState(false);
  const [refetchInvitations, setRefetchInvitations] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [invites, setInvites] = useState<Invitation[]>([]);
  const [userEmails, setUserEmails] = useState<UserDetails[]>([]);
  const [userEmailsLoading, setUserEmailsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("members");

  const book = books.find((b) => b.id.toString() === bookId);
  const loading =
    bookLoading || membersLoading || invitationsLoading || actionLoading;

  const refreshMembers = () => {
    setRefetchMembers((current) => !current);
  };

  const refreshInvitations = () => {
    setRefetchInvitations((current) => !current);
  };

  const refreshBook = () => {
    refetchRoles();
  };

  const copyLink = async () => {
    setActionLoading(true);
    const { err, data } = await createInviteLink(bookId);
    setActionLoading(false);
    if (err) {
      toast.error(err);
      return;
    }
    await navigator.clipboard.writeText(data.link);
    toast.success("Link copied to clipboard");
  };

  const isOwner = useHasPermission(Roles.AUTHOR);
  const canEdit = useHasPermission(Roles.EDITOR);

  useEffect(() => {
    if (!canEdit) return;

    (async () => {
      setUserEmailsLoading(true);
      const { err, data } = await getEmails();
      if (err) {
        toast.error(err);
      } else {
        setUserEmails(data as UserDetails[]);
      }
      setUserEmailsLoading(false);
    })();
  }, [canEdit]);

  useEffect(() => {
    (async () => {
      setMembersLoading(true);
      const { err, data } = await getBookMembers(bookId);
      if (err) {
        toast.error(err);
      } else {
        const membersList = [...(data as Member[])].sort((a, b) =>
          a.role.localeCompare(b.role),
        );
        setMembers(membersList);
      }
      setMembersLoading(false);
    })();
  }, [bookId, refetchMembers]);

  useEffect(() => {
    if (activeTab !== "invitations") return;

    (async () => {
      setInvitationsLoading(true);
      const { err, data } = await getInvitations(bookId);
      if (err) {
        toast.error(err);
      } else {
        setInvites(data as Invitation[]);
      }
      setInvitationsLoading(false);
    })();
  }, [activeTab, refetchInvitations, bookId]);

  return (
    <div>
      <div className="flex flex-row justify-between w-full">
        <div className="flex flex-row items-center gap-1 sm:gap-4">
          <Button onClick={() => router.back()} variant="outline">
            <ChevronLeft />
          </Button>
          <div className="flex flex-col">
            <h1 className="text-lg max-h-6 sm:text-2xl sm:max-h-8 max-w-120 font-bold line-clamp-1">
              {book?.name}
            </h1>
            <h4 className="text-xs line-clamp-2">
              {book?.description || "No description"}
            </h4>
          </div>
        </div>
        <div className="flex flex-row items-center gap-2" hidden={!isOwner}>
          <UploadTransactionFile
            hidden={!isOwner}
            showName={false}
            refetchAction={refetchRoles}
          />
        </div>
      </div>
      <div className="flex flex-col gap-4 mt-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full bg-background">
            <div className="flex flex-row w-full justify-between">
              <div>
                <TabsTrigger value="members">Members</TabsTrigger>
                {useHasPermission(Roles.EDITOR) && (
                  <>
                    <TabsTrigger value="invitations">Invitations</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                  </>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => copyLink()}
                  hidden={activeTab === "members"}
                >
                  <Share2Icon />{" "}
                  <span className="hidden sm:block">Copy invite Link</span>
                </Button>
                <AddOrInviteUser
                  userDetails={members}
                  userEmails={userEmails}
                  userEmailsLoading={userEmailsLoading}
                  refetchAction={(addedMember) => {
                    if (addedMember || activeTab === "members") refreshMembers();
                    else refreshInvitations();
                  }}
                  tab={activeTab as "invites" | "members"}
                  setActiveTabAction={setActiveTab}
                  showName={false}
                />
              </div>
            </div>
          </TabsList>
          <LoaderCircle loading={loading}>
            <TabsContent value="members">
              <MemberList
                members={members}
                userEmails={userEmails}
                userEmailsLoading={userEmailsLoading}
                refetchAction={refreshMembers}
              />
            </TabsContent>
            <TabsContent value="invitations">
              <InvitationList
                invitations={invites}
                userEmails={userEmails}
                userEmailsLoading={userEmailsLoading}
                refetchAction={refreshInvitations}
                loading={loading}
                setActiveTabAction={setActiveTab}
              />
            </TabsContent>
            <TabsContent value="settings">
              <div className="flex flex-col gap-8">
                <div>
                  <h2 className="font-semibold mb-1">Book Details</h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Update the name and description of your book.
                  </p>
                  <EditBook
                    bookId={bookId}
                    name={book?.name || ""}
                    refetchAction={refreshBook}
                    description={book?.description || ""}
                  />
                </div>

                <div className="border-t pt-8">
                  <h2 className="font-semibold mb-1">Payment Methods</h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Manage the payment methods available for transactions.
                  </p>
                  <PaymentMethodManager bookId={Number(bookId)} />
                </div>

                <div className="border-t pt-8">
                  <h2 className="font-semibold mb-1">Categories</h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Manage the categories available for transactions.
                  </p>
                  <CategoryManager bookId={Number(bookId)} />
                </div>

                <div className="border-t pt-8" hidden={!isOwner}>
                  <h2 className="font-semibold mb-1">Transfer Ownership</h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Transfer this book to another member. Your role will be
                    demoted to Editor.
                  </p>
                  <TransferBook
                    bookName={book?.name || ""}
                    userEmails={userEmails}
                    userEmailsLoading={userEmailsLoading}
                    refetchAction={() => {
                      refreshMembers();
                      refreshBook();
                    }}
                  />
                </div>

                <div
                  className="border-t border-destructive/40 pt-8 pb-4"
                  hidden={!isOwner}
                >
                  <h2 className="font-semibold text-destructive mb-1">
                    Danger Zone
                  </h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Permanently delete this book and all its transactions. This
                    cannot be undone.
                  </p>
                  <DeleteBook bookId={bookId} name={book?.name || ""} />
                </div>
              </div>
            </TabsContent>
          </LoaderCircle>
        </Tabs>
      </div>
    </div>
  );
}
