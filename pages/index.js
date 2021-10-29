/* eslint-disable @next/next/no-img-element */
import { useActor, useMachine, useSelector } from '@xstate/react';
import { createMachine, assign, spawn, send } from 'xstate';

const buttonStyle = { cursor: 'pointer', marginBottom: 10, borderRadius: 4, width: 200, backgroundColor: 'white', border: '2px solid black', padding: '10px 20px' }

const monsterMachine = createMachine({
  id: 'monster',
  context: { degree: 0 },
  initial: 'idle',
  states: {
    idle: {
      on: {
        SPIN_AWAY: 'spinning',
      },
    },
    spinning: {
      always: { target: 'idle', cond: ({ degree }) => degree >= 360, actions: 'clearSpin' },
      invoke: {
        src: () => send => {
          const spinInterval = setInterval(() => send('UPDATE_DEGREE'), 1000);
          return () => clearInterval(spinInterval);
        }
      },
      on: {
        CUT_THAT_OUT: { target: 'idle', actions: 'clearSpin' },
        UPDATE_DEGREE: { actions: 'updateDegree' },
      },
    },
  },
}, {
  actions: {
    updateDegree: assign({
      degree: ({ degree }) => degree + 20,
    }),
    clearSpin: assign({
      degree: 0,
    }),
  },
  activities: {
    startSpin: ({ degree }) => {
      const interval = setInterval(() => {
        assign({ degree: degree + 10 })
      }, 1000);
      return () => clearInterval(interval);
    },
  },
});

const toggleMachine = createMachine({
  id: 'toggle',
  initial: 'inactive',
  entry: 'spawnMonsterMachine',
  context: {
    showMonster: false,
    monsterRef: null,
    monsterUrl: null,
  },
  states: {
    inactive: {
      on: { TOGGLE: { actions: 'toggleMonster', target: 'active' } }
    },
    active: {
      on: { TOGGLE: { actions: 'toggleMonster', target: 'inactive' }, PICK_BOI: { actions: 'pickBoi' } }
    }
  },
}, { actions: {
  spawnMonsterMachine: assign({ monsterRef: () => spawn(monsterMachine, { sync: true, name: 'monster' }) }),
  toggleMonster: assign({ showMonster: ({ showMonster }) => !showMonster }),
  pickBoi: assign({ monsterUrl: (_, { payload: { monsterUrl } }) => monsterUrl }),
}});

const Monster = ({ machine, monsterUrl }) => {
  const [state, send] = useActor(machine);
  // const [state, send] = useActor(machine);
  const style = { transform: `rotate(${state.context.degree}deg)`, transition: 'transform 1s' };
  const spinAway = () => send('SPIN_AWAY');
  const cutThatOut = () => send('CUT_THAT_OUT');

  return (
    <section style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', width: 300, justifyContent: 'center', alignItems: 'center' }}>
        <h1>{'Spin Em'}</h1>
        <img style={style} alt="spooky" src={monsterUrl} />
        <button style={buttonStyle} onClick={state.value === 'idle' ? spinAway : cutThatOut}>
          {state.value === 'idle' ? 'Spin' : 'Stop'}
        </button>
      </div>
    </section>
  );
};

const MonsterChoice = ({ onSelect }) => (
  <section style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
    <div style={{ display: 'flex', flexDirection: 'column', width: 300, justifyContent: 'center', alignItems: 'center' }}>
    <h1>{'Pick Em'}</h1>
      <button style={buttonStyle} onClick={() => onSelect('pink-boi')}>
        {'Pink Monster'}
      </button>
      <button style={buttonStyle} onClick={() => onSelect('orange-boi')}>
        {'Orange Monster'}
      </button>
    </div>
  </section>
);

const MonsterActivate = ({ send, active }) => (
  <section style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
    <div style={{ display: 'flex', flexDirection: 'column', width: 300, justifyContent: 'center', alignItems: 'center' }}>
      <h1>{'Activate Em'}</h1>
      <button style={buttonStyle} disabled={active} onClick={() => send('TOGGLE')}>
        {'Activate'}
      </button>
      <button style={buttonStyle} disabled={!active} onClick={() => send('TOGGLE')}>
        {'Deactivate'}
      </button>
    </div>
  </section>
);

const getMonsterContext = (state) => state.context;

const BigBusiness = () => {
  const monsters = {
    'orange-boi': 'https://media0.giphy.com/media/jmqGQLYvKYZz4D0f31/200w.gif',
    'pink-boi': 'https://media2.giphy.com/media/h1tObrNE1q9QO3MQFj/200w.gif',
  };
  const [state, send] = useMachine(toggleMachine, { name: 'main', devTools: true });
  const onMonsterSelect = (monsterId) => send({ type: 'PICK_BOI', payload: { monsterUrl: monsters[monsterId] } });
  const monsterContext = useSelector(state.context.monsterRef, getMonsterContext);
  const monsterContextTwo = state.context.monsterRef.getSnapshot();
  
  console.log(monsterContext);
  console.log(monsterContextTwo.value);

  return (
    <main style={{ padding: 20 }}>
      <MonsterActivate send={send} active={state.value === 'active'} />
      {state.value === 'active' && (
        <>
          <MonsterChoice onSelect={onMonsterSelect} />
          {state.context.monsterUrl && <Monster machine={state.context.monsterRef} monsterUrl={state.context.monsterUrl} />}
        </>
      )}
    </main>
  );
};

export default BigBusiness;
