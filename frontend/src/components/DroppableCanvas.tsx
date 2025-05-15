import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { PropsWithChildren, ReactNode } from 'react';
import { Box } from '@mui/material';

interface ChildrenProps  {
  children: ReactNode[]
}
export const DroppableCanvas = ({children}: ChildrenProps) => {

  const onDragEnd = () => {

  }

  return (
    // <div>
    //   {children}
    // </div>
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId='droppable'>
        {(provided, snapshot) => (
          <div>
          {children.map((item, index) => (
            <Draggable index={index} draggableId={index.toString()}>
              {(provided, snapshot) => (
                <div>
                  {item}
                </div>
              )}
            </Draggable>
          ))
            
          }
        </div>
        )}
      
      </Droppable>
    </DragDropContext>
  )
}