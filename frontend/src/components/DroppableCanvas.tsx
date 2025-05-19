import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd';
import { PropsWithChildren, ReactNode, useState, useEffect, ReactElement, isValidElement, cloneElement } from 'react';
import { Box, Divider, Stack } from '@mui/material';
import { ReminderExcerpt } from './ReminderExcerpt';
import { Reminder } from '../interfaces/RemindersInterfaces';


interface ChildrenProps  {
  reminders: Reminder[]
}

export const DroppableCanvas = ({reminders}: ChildrenProps) => {

  const [items, setItems] = useState(reminders)
  const reorder = (list: any[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };
  const onDragEnd = (result: any) => {
    console.log(items)
    const reorderedItems = reorder(items, result.source.index, result.destination.index);
    console.log(reorderedItems)
    setItems(reorderedItems)
  }

  useEffect(() => {
    setItems(reminders)
  }, [reminders])
  /**
   * Most of this is boilerplate (i.e the refs, the provided spreads)
   */
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId='droppable'>
        {(provided, snapshot) => (
          <Stack spacing={1} ref={provided.innerRef}
            {...provided.droppableProps} >
          {items.map((item, index) => (
            <Draggable key={index} index={index} draggableId={index.toString()}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  
                >
                  {provided.dragHandleProps && <ReminderExcerpt reminder={item} dragHandle={{...provided.dragHandleProps}} />}
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
          </Stack>
        )}
      </Droppable>
    </DragDropContext>
  )
}