import { createMachine, assign, spawn } from 'xstate';

export const monsterMachine = createMachine({
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
      }, 500);
      return () => clearInterval(interval);
    },
  },
});

export const activateMachine = createMachine({
  id: 'activate',
  initial: 'inactive',
  entry: 'spawnMonsterMachine',
  context: {
    showMonster: false,
    monsterRef: null,
    monsterUrl: null,
    monsters: null,
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