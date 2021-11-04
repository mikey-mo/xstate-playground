import { useInterpret, useSelector } from '@xstate/react';
import { useRouter } from 'next/router';

// eslint-disable-next-line react/display-name
const withProtected = ({ machine, context, router }) => (WrappedComponent) => (props) => {
  const router = useRouter();
  if (!router.isReady) return null;
  const service = useInterpret(machine.withContext(context).withConfig({
    actions: {
      failure: (_, __, { state }) => {
        router.push(state.meta.route.failureRedirect)
        return;
      },
    },
  }));
  const stateValue = useSelector(service, (state) => state.value);

  if (stateValue === 'success') (<WrappedComponent {...props} />);

  return null;
};


export default withProtected;
