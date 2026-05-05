'use client';

import * as React from 'react';
import { CalendarIcon, Clock2Icon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { fmtDate } from '../../lib';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';

interface DatePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  time: string;
  setTime: (time: string) => void;
  label?: string;
}

export function DatePicker({ date, setDate, time, setTime }: DatePickerProps) {
  const [popoverOpen, setPopoverOpen] = React.useState(false);

  return (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            'w-full justify-start text-left font-normal',
            !date && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date && !popoverOpen ? fmtDate(date, true) : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          autoFocus
          disabled={(date) => date > new Date()}
        />
        <div className='m-2'>
          <InputGroup>
            <InputGroupInput
              id="time-from"
              type="time"
              step="1"
              defaultValue={time}
              onChange={(e) => {
                setTime(e.target.value)
                setDate(date)
              }}
              className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
            />
            <InputGroupAddon>
              <Clock2Icon className="text-muted-foreground" />
            </InputGroupAddon>
          </InputGroup>
        </div>
      </PopoverContent>
    </Popover>
  );
}
