'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

const Calendar = ({ selectedDate, onSelect, className, classNames, showOutsideDays = true, ...props }: CalendarProps) => {
  return (
    <Card className="p-4 w-full">
      <DayPicker
        mode="single"
        selected={selectedDate}
        onSelect={onSelect}
        showOutsideDays={showOutsideDays}
        className={cn('p-3', className)}
        classNames={{
          months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 w-full',
          month: 'space-y-4 w-full',
          caption: 'flex justify-center pt-1 relative items-center',
          caption_label: 'text-sm font-medium',
          nav: 'space-x-1 flex items-center',
          nav_button: cn(
            buttonVariants({ variant: 'outline' }),
            'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100'
          ),
          nav_button_previous: 'absolute left-1',
          nav_button_next: 'absolute right-1',
          table: 'w-full border-collapse space-y-1',
          head_row: 'flex w-full justify-between',
          head_cell: 'text-muted-foreground rounded-md w-8 font-normal text-[0.8rem] text-center',
          row: 'flex w-full justify-between mt-2',
          cell: 'relative w-8 h-8 text-center text-sm p-0 focus-within:relative focus-within:z-20',
          day: cn(
            buttonVariants({ variant: 'ghost' }),
            'h-8 w-8 p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground'
          ),
          day_range_end: 'day-range-end',
          day_selected: 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
          day_today: 'bg-primary/10 text-primary font-semibold',
          day_outside: 'text-muted-foreground opacity-50',
          day_disabled: 'text-muted-foreground opacity-50',
          day_range_middle: 'aria-selected:bg-accent aria-selected:text-accent-foreground',
          day_hidden: 'invisible',
          ...classNames,
        }}
        components={{
          IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
          IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
        }}
        modifiersStyles={{
          today: {
            fontWeight: 'bold',
            color: 'var(--primary)',
            border: '2px solid var(--primary)'
          },
          selected: {
            backgroundColor: 'var(--primary)',
            color: 'white',
            fontWeight: 'bold'
          }
        }}
        {...props}
      />
    </Card>
  );
};

Calendar.displayName = 'Calendar';

export { Calendar };
