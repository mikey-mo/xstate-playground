/* eslint-disable @next/next/no-img-element */
import { useActor } from "@xstate/react";

const buttonStyle = { cursor: 'pointer', marginBottom: 10, borderRadius: 4, width: 200, backgroundColor: 'white', border: '2px solid black', padding: '10px 20px' };

const Monster = ({ machine, monster }) => {
  const [state, send] = useActor(machine);
  const style = { transform: `rotate(${state.context.degree}deg)`, transition: 'transform 1s' };
  const spinAway = () => send('SPIN_AWAY');
  const cutThatOut = () => send('CUT_THAT_OUT');

  return (
    <section style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', width: 300, justifyContent: 'center', alignItems: 'center' }}>
        <h1>{'Spin Em'}</h1>
        <img style={style} alt="spooky" src={monster} />
        <button style={buttonStyle} onClick={state.value === 'idle' ? spinAway : cutThatOut}>
          {state.value === 'idle' ? 'Spin' : 'Stop'}
        </button>
      </div>
    </section>
  );
};

export default Monster;
