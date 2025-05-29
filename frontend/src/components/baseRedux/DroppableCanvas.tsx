import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { Stack } from '@mui/material';
import { ReminderExcerpt } from './ReminderExcerpt';
import { useAppSelector } from '../../hooks/useAppSelector';
import { selectReminders, rearrangeReminders } from '../../app/remindersSlice';
import { useAppDispatch } from '../../hooks/useAppDispatch';

export const DroppableCanvas = () => {

  const reduxReminders = useAppSelector(selectReminders)
  const dispatch = useAppDispatch();
  const reorder = (list: any[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };
  const onDragEnd = (result: any) => {
    const reorderedItems = reorder(reduxReminders, result.source.index, result.destination.index);
    console.log(reorderedItems)
    dispatch(rearrangeReminders(reorderedItems))
  }


  /**
   * Most of this is boilerplate (i.e the refs, the provided spreads)
   */
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId='droppable'>
        {(provided, snapshot) => (
          <Stack spacing={1} ref={provided.innerRef}
            {...provided.droppableProps} >
          {reduxReminders.map((item, index) => (
            <ReminderExcerpt key={index} reminder={item} index={index} />
          ))}
          {provided.placeholder}
          </Stack>
        )}
      </Droppable>
    </DragDropContext>
  )
}