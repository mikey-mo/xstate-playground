import { useInterpret, useSelector } from '@xstate/react';
import { useRouter } from 'next/router';

// eslint-disable-next-line react/display-name
const withProtected = ({ machine }) => (WrappedComponent) => (props) => {
  const router = useRouter();

  if (!router.isReady) return null;

  const service = useInterpret(machine.withConfig({
    actions: {
      failure: (_, __, { state }) => {
        const { redirectMethod = 'push', redirectPath } = state.meta[`route.${state.value}`];
        router[redirectMethod](redirectPath);
        return null;
      },
    },
  }));
  const stateValue = useSelector(service, (state) => state.value);

  if (stateValue === 'success')
    return (<WrappedComponent {...props} />);

  return null;
};


export default withProtected;
