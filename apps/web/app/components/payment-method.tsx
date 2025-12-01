import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { PaymentMethodEnum } from '../enums/payment-methods';

export function PaymentMethod({
  paymentMethod,
  setPaymentMethod,
}: {
  paymentMethod: PaymentMethodEnum;
  setPaymentMethod: (v: PaymentMethodEnum) => void;
}) {
  return (
    <Select
      onValueChange={v => {
        setPaymentMethod(v as PaymentMethodEnum);
      }}
    >
      <SelectTrigger aria-label="Payment Type" className="w-40">
        <div className="flex items-center gap-2">
          <span className="text-sm">{paymentMethod}</span>
        </div>
      </SelectTrigger>
      <SelectContent>
        {Object.keys(PaymentMethodEnum).map(k => (
          <SelectItem key={k} value={k}>
            {k}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
