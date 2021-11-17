import { createMachine, assign, spawn, sendUpdate } from 'xstate';

import { wildcardFetch, ERRORS } from './services';

const randomize = () => Math.random() * 100 > 5;

export const routeMachine = createMachine({
  id: 'route',
  context: {
    transfer: {
      linkId: null,
      recipientName: null,
    },
  },
  initial: 'idle',
  states: {
    idle: {
      tags: ['loading'],
      always: [
        {
          target: 'success', cond: randomize(),
        },
        {
          target: 'noAuth', cond: randomize(),
        },
        {
          target: 'limitFail', cond: () => true,
        }
      ],
    },
    noAuth: {
      entry: 'failure',
      type: 'final',
      meta: {
        redirectPath: '/invalid-auth',
        redirectMethod: 'push',
      }
    },
    limitFail: {
      entry: 'failure',
      type: 'final',
      meta: {
        redirectPath: '/limit-fail',
        redirectMethod: 'replace',
      }
    },
    success: { type: 'final' },
  }
});

export const monsterMachine = createMachine({
  id: 'monster',
  context: { degree: 0, errors: {} },
  initial: 'idle',
  states: {
    idle: {
      entry: sendUpdate(),
      on: {
        SPIN_AWAY: { target: 'fetchWildcard', actions: assign({ errors: {} }) },
      },
    },
    fetchWildcard: {
      invoke: {
        id: 'fetch-wildcard',
        src: 'wildcardFetch',
        onDone: 'spinning',
        onError: [
          { target: 'idle', cond: (_, { data: { status } }) => status === 400 },
          { target: 'error' },
        ],
      }
    },
    error: {
      entry: assign({
        errors: (_, { data: { status } }) => {
          switch (status) {
          case ERRORS[0].status:
            return { input: ERRORS[0].status };
          case ERRORS[1].status:
            return { input: ERRORS[1].status };
          case ERRORS[2].status:
            return { output: ERRORS[2].status };
          case ERRORS[3].status:
            return { output: ERRORS[3].status };
          }
        },
      }),
      always: [{ target: 'idle' }],
    },
    spinning: {
      entry: sendUpdate(),
      always: { target: 'idle', cond: ({ degree }) => degree >= 360, actions: ['clearSpin', sendUpdate()] },
      invoke: {
        src: () => send => {
          const spinInterval = setInterval(() => send('UPDATE_DEGREE'), 1000);
          return () => clearInterval(spinInterval);
        }
      },
      on: {
        CUT_THAT_OUT: { target: 'idle', actions: ['clearSpin', sendUpdate()] },
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
  services: { wildcardFetch },
});

export const activateMachine = createMachine({
  id: 'activate',
  initial: 'inactive',
  entry: 'spawnMonsterMachine',
  context: {
    showMonster: false,
    monsterRef: null,
    monster: { id: null, url: null },
    monsters: null,
  },
  states: {
    inactive: {
      on: { TOGGLE: { actions: 'toggleMonster', target: 'active' } }
    },
    active: {
      on: { TOGGLE: { actions: 'toggleMonster', target: 'inactive' }, PICK_MONSTER: { actions: 'pickMonster' } }
    }
  },
}, { actions: {
  spawnMonsterMachine: assign({ monsterRef: () => spawn(monsterMachine, { name: 'monster' }) }),
  toggleMonster: assign({ showMonster: ({ showMonster }) => !showMonster }),
  pickMonster: assign({ monster: (_, { payload }) => payload }),
}});

export const VIEW_STATES = { ACTIVE: 'active', INACTIVE: 'inactive' };