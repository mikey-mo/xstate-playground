/* eslint-disable @next/next/no-img-element */
import { useActor } from "@xstate/react";
import errorTranslator from "./utils/errorTranslator";

const buttonStyle = { cursor: 'pointer', marginBottom: 10, borderRadius: 4, width: 200, backgroundColor: 'white', border: '2px solid black', padding: '10px 20px' };

const Monster = ({ machine, monsterUrl }) => {
  const [state, send] = useActor(machine);
  const style = { transform: `rotate(${state.context.degree}deg)`, transition: 'transform 1s' };
  const spinAway = () => send('SPIN_AWAY');
  const cutThatOut = () => send('CUT_THAT_OUT');

  return (
    <section style={{ marginTop: 10, width: '100%', display: 'flex', justifyContent: 'center' }}>
      <div style={{ borderRadius: 10, backgroundColor: 'teal', display: 'flex', flexDirection: 'column', padding: 40, width: 500, justifyContent: 'center', alignItems: 'center' }}>
        {Object.keys(state.context.errors).length !== 0 && <h1 style={{ backgroundColor: 'white', padding: '10px 20px', borderRadius: 10 }}>{errorTranslator(state.context.errors)}</h1>}
        <h1>{'Spin Em'}</h1>
        <img style={style} alt="spooky" src={monsterUrl} />
        <button style={buttonStyle} onClick={state.value === 'idle' ? spinAway : cutThatOut}>
          {state.value === 'idle' ? 'Spin' : 'Stop'}
        </button>
      </div>
    </section>
  );
};

export default Monster;
