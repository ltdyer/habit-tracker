import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { Stack } from '@mui/material';
import { ReminderExcerptRTKQ } from '../rtkQuery/ReminderExcerptRTKQ';
import { useFetchRemindersQuery } from '../../app/remindersSliceRTKQ';
import { useEffect, useState } from 'react';
import { Reminder } from '../../interfaces/RemindersInterfaces';


export const DroppableCanvasRTKQ = () => {

  /**
   * Would be much simpler to just use local state since this is the only component that uses this updated client side
   * reminders list. However, its the principle - there is likely to be a scenario
   * where you need to update something client side and then use in an unrelated component
   * so we are doing it this way
   * 
   * UPDATE: we are now utilizing a more rtk query focused approach by using the query hook cached data from ReminderDisplay
   * rather than getting the results from the pure redux store slice. There is a genuine case to be made for still
   * putting stuff in the store and retreiving it if one component is doing client side data manipulation and another
   * unrelated component needs it!!!! But that is not our case so instead I will show off a very rtk query focused approach
   */
  // const reduxReminders = useAppSelector(selectReminders);

  /**
   * I'm pretty sure we still need dispatch if we need to handle client side state that doesn't
   * involve any sort of server. In our example, that is only the local state we have that
   * keeps track of how our reminders have been rearranged
   */
  // const dispatch = useAppDispatch()

  /**
   * NVM, we are trying to be more RTK Query focused. If we are merely fetching results from the server, we can just utilize the 
   * cached results from the ReminderDisplay query hook. This component is just another subscriber to that query
   */
  const {
    data: reminders = [],
    isSuccess
  } = useFetchRemindersQuery()

  const [reorderedReminders, reorderReminders] = useState<Reminder[]>([])

  useEffect(() => {
    if (isSuccess && reminders) {
      reorderReminders(reminders)
    } 
    
  }, [reminders])


  const reorder = (list: any[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };
  const onDragEnd = (result: any) => {
    const reorderedItems = reorder(reorderedReminders, result.source.index, result.destination.index);
    console.log(reorderedItems)
    reorderReminders(reorderedItems)
    //dispatch(rearrangeReminders(reorderedItems))
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
          {reorderedReminders.map((item, index) => (
            <ReminderExcerptRTKQ key={index} reminder={item} index={index} />
          ))}
          {provided.placeholder}
          </Stack>
        )}
      </Droppable>
    </DragDropContext>
  )
}