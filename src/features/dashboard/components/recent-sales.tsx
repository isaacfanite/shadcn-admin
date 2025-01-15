import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';
import { Skeleton } from "@/components/ui/skeleton"

async function getData() {
  // Define headers
  const headers = {
    'Content-Type': 'application/json',
    "x-access-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzMwMjAwNzI4LCJleHAiOjE3MzAyODcxMjh9.D1grn3jzsho4fztj5Pj9OGJRTtpSPT7ghOJMH9UJ-Pw", // Replace with your actual token
  };

  const res = await fetch('https://api.fanitehub.com/v2/latest/txns?merchantId=1234', {
    method: 'GET',
    headers: headers,
  });

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  const data = await res.json();
  return data;
}

export function RecentTxns() {
  const [txns, setTxns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getData();
        setTxns(data); // Assuming data is an array of transactions
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return 
    <div className="flex items-center space-x-4">
    <Skeleton className="h-12 w-12 rounded-full" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-[250px]" />
      <Skeleton className="h-4 w-[200px]" />
    </div>
  </div>;
  }

  return (
    <div className='space-y-8'>
    {txns.map((txn, index) => {
      // Parse the customer and orders fields
      const customerData = JSON.parse(txn.customer[0]);
      const orderData = JSON.parse(txn.orders[0]);

      return (
        <div key={index} className='flex items-center'>
          <Avatar className='h-9 w-9'>
            <AvatarImage src='/avatars/01.png' alt='Avatar' />
            <AvatarFallback>
              {customerData.name
                .split(' ')
                .map(n => n[0])
                .join('')}
            </AvatarFallback>
          </Avatar>
          <div className='ml-4 space-y-1'>
            <p className='text-sm font-medium leading-none'>{customerData.name}</p>
            <p className='text-sm text-muted-foreground'>{customerData.email}</p>
            <p className='text-sm text-muted-foreground'>{txn.createdAt}</p>
          </div>
          <div className='ml-auto font-medium'>
          <div className='ml-4 space-y-1'>
            <p className='text-sm font-medium leading-none'>{txn.amount}/= Ugx</p>
            <Badge
              className={`${txn.status.toLowerCase() === 'success'
                ? 'text-[#10b981] bg-[#10b981]/10 border-[#10b981]/20 hover:bg-[#10b981]/10'
                : txn.status.toLowerCase() === 'failed'
                ? 'text-[#ec4899] bg-[#ec4899]/10 border-[#ec4899]/20 hover:bg-[#ec4899]/10'
                : txn.status.toLowerCase() === 'pending'
                ? 'text-[#f97316] bg-[#f97316]/10 border-[#f97316]/20 hover:bg-[#f97316]/10'
                : 'text-[#0ea5e9] bg-[#0ea5e9]/10 border-[#0ea5e9]/20 hover:bg-[#0ea5e9]/10'
              }`}
            >
              {txn.status}
            </Badge>
          </div>
          </div>
        </div>
      );
    })}
  </div>
  );
}
