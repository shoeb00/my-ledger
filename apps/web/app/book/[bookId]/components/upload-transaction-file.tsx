import { useParams } from "next/navigation";
import { useHasPermission } from "../../../lib";
import { Roles } from "@my-ledger/api/role";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { Dropzone, DropZoneArea, DropzoneTrigger, useDropzone } from "@/components/ui/dropzone";
import { AddTransactionRequest, bulkAddTransaction } from "../actions/add-transaction";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { parseCsvFile } from "../helper/parser";
import { FileUpIcon } from "lucide-react";

type Props = {
    setLoading: (bool: boolean) => void,
    refetchAction: () => void
    hidden: boolean
}

export default function UploadTransactionFile({ setLoading, refetchAction, hidden }: Props) {
    const params = useParams();
    const bookId = params.bookId as string;
    const isOwner = useHasPermission(Roles.AUTHOR);
    const [open, setOpen] = useState(false);

    const handleBulkAddTransactions = async (transactions: AddTransactionRequest[]) => {
        const { err, data } = await bulkAddTransaction({ transactions }, bookId);
        if (err) {
            toast.error(err);
        } else {
            toast.success(data.message);
            refetchAction();
        }
        setLoading(false);
        setOpen(false);
    }

    const handleUpload = async (file: File) => {
        try {
            const parsedData = await parseCsvFile(file);
            await handleBulkAddTransactions(parsedData);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : error?.toString());
        }
        setLoading(false);
        setOpen(false);
    }

    const dropzone = useDropzone({
        onDropFile: async (file: File) => {
            setLoading(true);
            await handleUpload(file);
            return { status: "success", result: 'Transactions added successfully' };
        },
        validation: {
            accept: {
                "text/csv": [".csv"],
            },
            maxSize: 512 * 1024,
            maxFiles: 1,
        },
        shiftOnMaxFiles: true,
    });

    return <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger hidden={!isOwner || hidden}>
            <Button onClick={() => setOpen(true)}>Bulk Add Transaction </Button>
        </DialogTrigger>
        <DialogContent className="h-[50%] pt-10">
            <Dropzone {...dropzone}>
                <DropZoneArea>
                    <DropzoneTrigger className="h-full w-full flex flex-col items-center justify-center">
                        <FileUpIcon className=" h-20 w-20 text-muted-foreground" />
                        <p className="font-semibold">Upload .csv file</p>
                        <p className="text-sm text-muted-foreground">
                            Click here or drag and drop to upload
                        </p>
                    </DropzoneTrigger>
                </DropZoneArea>
            </Dropzone>
        </DialogContent>
    </Dialog>
}