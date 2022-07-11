import React, { useState } from 'react';
import { isNil } from '../utils/utils';
import HabitModal from './HabitModal';
import { useModal } from './hooks/useModal';
/**
 * Lowering state for the modals, this prevents renders from affecting the overal app.
 *
 * Passing the callback from this stateful context to a ref to parent context that has the button event invokers.
 *
 * Rendering and managing state locally for two modals, a create modal and an edit modal.
 *
 * State must be tied to a specific instance. or if state is a collection, spread over a collection of instances.
 *
 * State mirrors the data.  If you only render one piece of data, you need to decided which component to render it in.
 *
 * Make sure to dismount Modal component when finished, otherwise its doing weird things with state between the two modals, create and edit. This whole approach is experimental.
 */
export default function Modal(props) {
  const { data, openModalCallBack, updateView } = props;
  const [isOpenCreate, openCreate, closeCreate] = useModal();
  const [isOpenEdit, openEdit, closeEdit] = useModal();
  const [state, setState] = useState({
    id: null,
    type: null,
  });
  const { id, type } = state;

  const openHandler = (type, id) => {
    setState({
      id,
      type,
    });
    type === 'create' ? openCreate() : openEdit();
  };
  openModalCallBack.current = openHandler;

  if (isNil(type)) {
    return null;
  }

  return (
    <>
      {isOpenEdit && (
        <HabitModal
          data={data?.[id]}
          updateView={updateView}
          open={isOpenEdit}
          close={closeEdit}
        />
      )}

      {isOpenCreate && (
        <HabitModal
          updateView={updateView}
          open={isOpenCreate}
          close={closeCreate}
          create={true}
        />
      )}
    </>
  );
}
