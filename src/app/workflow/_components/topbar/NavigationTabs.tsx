'use client';

import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

function NavigationTabs({workflowId}: {workflowId: string}) {
  const pathName = usePathname();
  const activeValue = pathName?.split('/')[2];

  return (
    <Tabs className='w-[400px]' value={activeValue}>
        <TabsList className='grid w-full grid-cols-2'>
            <Link href={`/workflow/editor/${workflowId}`}>
              <TabsTrigger value='editor' className='w-full'>Editor</TabsTrigger>
            </Link>
            <Link href={`/workflow/runs/${workflowId}`}>
              <TabsTrigger value='runs' className='w-full'>Runs</TabsTrigger>
            </Link>
        </TabsList>
    </Tabs>
  )
}

export default NavigationTabs