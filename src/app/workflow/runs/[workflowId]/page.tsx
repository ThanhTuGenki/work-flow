import { InboxIcon, Loader2Icon } from 'lucide-react';
import { Suspense } from 'react';
import { GetWorkflowExecutions } from '../../../../../actions/workflows/getWorkflowExecutions';
import Topbar from '../../_components/topbar/Topbar';
import ExecutionsTable from './_components/ExecutionsTable';

function page({ params }: { params: { workflowId: string } }) {
  return (
    <div className="h-full w-full overflow-auto">
      <Topbar
        workflowId={params.workflowId}
        hideButtons
        title='All runs'
        subtitle='List of your workflow runs'
      />
      <Suspense fallback={
        <div className='flex w-full h-full items-center justify-center'>
          <Loader2Icon size={30} className='animate-spin stroke-primary' />
        </div>
      }>
        <ExecutionsTableWrapper workflowId={params.workflowId} />
      </Suspense>
    </div>
  )
}

async function ExecutionsTableWrapper({ workflowId }: { workflowId: string }) {
  const executions = await GetWorkflowExecutions(workflowId);

  if (!executions) {
    return <div>No data</div>
  }

  if (!executions.length) {
    return (
      <div className='container w-full py-4'>
        <div className='flex flex-col items-center justify-center gap-2 w-full h-full'>
          <div className='rounded-full bg-accent w-20 h-20 flex items-center justify-center'>
            <InboxIcon size={40} className='stroke-primary' />
          </div>
          <div className="flex flex-col gap-1 text-center">
            <p className="font-bold">No runs have been trigger yet for this workflow</p>
            <p className="text-sm text-muted-foreground">You can trigger a new run the editor page</p>
          </div>
        </div>
      </div>
    )
  }

  return <div className='container w-full py-6'>
    <ExecutionsTable initialData={executions} workflowId={workflowId} />
  </div>
}

export default page;