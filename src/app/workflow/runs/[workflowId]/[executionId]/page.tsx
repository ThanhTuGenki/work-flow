import Topbar from '@/app/workflow/_components/topbar/Topbar';
import { Loader2Icon } from 'lucide-react';
import { Suspense } from 'react';
import { GetWorkflowExecutionWithPhases } from '../../../../../../actions/workflows/getWorkflowExecutionWithPhases';
import ExecutionViewer from './_components/ExecutionViewer';

function page({ params }: { params: { workflowId: string, executionId: string } }) {
    return (
        <div className='flex flex-col h-screen w-full overflow-hidden'>
            <Topbar
                workflowId={params.workflowId}
                title='Workflow run details'
                subtitle={`Run ID ${params.executionId}`}
                hideButtons
            />
            <section className='flex h-full overflow-auto'>
                <Suspense
                    fallback={
                        <div className='flex w-full items-center justify-center'>
                            <Loader2Icon className='w-10 h-10 animate-spin stroke-primary' />
                        </div>
                    }
                >
                    <ExecutionViewerWrapper executionId={params.executionId} />
                </Suspense>
            </section>
        </div>
    )
}

async function ExecutionViewerWrapper({ executionId }: { executionId: string }) {
    const workflowExecution = await GetWorkflowExecutionWithPhases(executionId);
    if (!workflowExecution) return <div>workflow not found</div>

    return (
        <ExecutionViewer initialData={workflowExecution} />
    )
}

export default page