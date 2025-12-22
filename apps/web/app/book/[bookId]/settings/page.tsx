'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BookResponse, getBook } from '../../actions/get-books';
import { getBookMembers } from './actions/members';
import { getInvitations } from './actions/invitations';
import { toast } from 'sonner';
import { Roles } from '@my-ledger/api/role';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';
import EditBook from './components/edit-book';
import DeleteBook from './components/delete-book';
import TransferBook from './components/transfer-book';
import MemberRow from './components/member';
import LoaderCircle from '../../../components/loader';
import InvitationList from './components/invites';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AddOrInviteUser from './components/addOrInviteUser';

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
  const [loading, setLoading] = useState(true);
  const [book, setBook] = useState<BookResponse | null>(null);
  const [refetchAction, setRefetchAction] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [invites, setInvites] = useState<Invitation[]>([]);
  const [activeTab, setActiveTab] = useState('members');

  useEffect(() => {
    (async () => {
      const { err, data } = await getBook(bookId);
      if (err) toast.error(err);
      if (data[0]) setBook(data[0]);
    })();
  }, [bookId, refetchAction]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { err, data } = await getBookMembers(bookId);
      if (err) {
        toast.error(err);
      } else {
        setMembers(data as Member[]);
      }
      setLoading(false);
    })();
  }, [bookId, refetchAction]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { err, data } = await getInvitations();
      if (err) {
        toast.error(err);
      } else {
        setInvites(data as Invitation[]);
      }
      setLoading(false);
    })();
  }, [refetchAction]);

  return (
    <div>
      <div className="flex flex-row justify-between">
        <div className="flex flex-row items-center gap-4">
          <Button onClick={() => router.back()} variant="outline">
            <ChevronLeft />
          </Button>
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold">{book?.name}</h1>
            <h4 className="text-sm">{book?.description || 'No description'}</h4>
          </div>
          <EditBook
            bookId={bookId}
            name={book?.name || ''}
            refetchAction={() => setRefetchAction(!refetchAction)}
            description={book?.description || ''}
          />
        </div>
        <div className="flex flex-row items-center gap-4">
          <TransferBook bookId={bookId} name={book?.name || ''} />
          <DeleteBook bookId={bookId} name={book?.name || ''} />
        </div>
      </div>
      <div className="flex flex-col gap-4 mt-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full">
            <div className="flex flex-row w-full justify-between">
              <div>
                <TabsTrigger value="members">Members</TabsTrigger>
                <TabsTrigger value="invitations">Invitations</TabsTrigger>
              </div>
              <AddOrInviteUser
                userDetails={members}
                refetchAction={() => setRefetchAction(!refetchAction)}
                tab={activeTab as 'invites' | 'members'}
              />
            </div>
          </TabsList>
          <LoaderCircle loading={loading}>
            <TabsContent value="members">
              <MemberRow members={members} refetchAction={() => setRefetchAction(!refetchAction)} />
            </TabsContent>
            <TabsContent value="invitations">
              <InvitationList
                invitations={invites}
                refetchAction={() => setRefetchAction(!refetchAction)}
              />
            </TabsContent>
          </LoaderCircle>
        </Tabs>
      </div>
    </div>
  );
}
