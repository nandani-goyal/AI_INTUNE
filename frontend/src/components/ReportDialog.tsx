import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface ReportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
}

const ReportDialog = ({ isOpen, onClose, userName }: ReportDialogProps) => {
  const [reason, setReason] = useState("");
  const [additionalDetails, setAdditionalDetails] = useState("");
  const { toast } = useToast();

  const reportReasons = [
    { value: "inappropriate-behavior", label: "Inappropriate behavior" },
    { value: "harassment", label: "Harassment or bullying" },
    { value: "fake-profile", label: "Fake profile or information" },
    { value: "spam", label: "Spam or promotional content" },
    { value: "unsafe-behavior", label: "Unsafe or threatening behavior" },
    { value: "other", label: "Other (please specify)" },
  ];

  const handleSubmit = () => {
    if (!reason) {
      toast({
        title: "Please select a reason",
        description: "You must select a reason for reporting this user.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Report Submitted",
      description: `Your report for ${userName} has been sent to our admin team. Further action will be taken after review.`,
    });

    // Reset form
    setReason("");
    setAdditionalDetails("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Report User: {userName}</DialogTitle>
          <DialogDescription>
            Help us keep InTune safe by reporting inappropriate behavior. All reports are reviewed by our moderation team.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Reason for reporting:</Label>
            <RadioGroup value={reason} onValueChange={setReason} className="mt-2">
              {reportReasons.map((reportReason) => (
                <div key={reportReason.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={reportReason.value} id={reportReason.value} />
                  <Label htmlFor={reportReason.value} className="text-sm">
                    {reportReason.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="details" className="text-sm font-medium">
              Additional details (optional):
            </Label>
            <Textarea
              id="details"
              placeholder="Please provide any additional context about this report..."
              value={additionalDetails}
              onChange={(e) => setAdditionalDetails(e.target.value)}
              className="mt-2"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-destructive hover:bg-destructive/90">
            Submit Report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReportDialog;