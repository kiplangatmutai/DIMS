import React from 'react';
export type StatusType =
'Draft' |
'Submitted' |
'Pending Sub-County' |
'Pending County' |
'Pending DHA' |
'Approved' |
'Rejected' |
'Dispatched' |
'Pending Facility Acceptance' |
'Device Accepted' |
'Awaiting Support' |
'In Progress' |
'Picked' |
'Resolved' |
'Returned' |
'Replaced' |
'Stolen' |
'Recovered';
interface StatusPillProps {
  status: StatusType;
}
export function StatusPill({ status }: StatusPillProps) {
  let bg = 'bg-neutral-100';
  let text = 'text-neutral-700';
  let border = 'border-neutral-200';
  // Deep blue: Blocking / Critical
  if (['Rejected', 'Stolen'].includes(status)) {
    bg = 'bg-brand-700';
    text = 'text-white';
    border = 'border-brand-800';
  }
  // Ice blue: In-flight / Pending
  else if (
  [
  'Submitted',
  'Pending Sub-County',
  'Pending County',
  'Pending DHA',
  'Dispatched',
  'Pending Facility Acceptance',
  'In Progress',
  'Picked'].
  includes(status))
  {
    bg = 'bg-accent-50';
    text = 'text-black';
    border = 'border-accent-200';
  }
  // White/black: Resolved / Accepted
  else if (
  [
  'Approved',
  'Device Accepted',
  'Resolved',
  'Returned',
  'Replaced',
  'Recovered'].
  includes(status))
  {
    bg = 'bg-white';
    text = 'text-black';
    border = 'border-brand-200';
  }
  // Cool blue: Action needed
  else if (['Awaiting Support'].includes(status)) {
    bg = 'bg-brand-50';
    text = 'text-black';
    border = 'border-brand-200';
  }
  // Gray: Draft (default)
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${bg} ${text} ${border}`}>
      
      {status}
    </span>);

}
