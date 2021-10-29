/* eslint-disable @next/next/no-img-element */
import { useMachine } from '@xstate/react';
import monsters from '../data/monsters.json';

import MonsterActivate from '../common/MonsterActivate';
import MonsterChoice from '../common/MonsterChoice';
import Monster from '../common/Monster';

import { activateMachine } from '../machines';

const Index = ({ monsters }) => {
  const [state, send] = useMachine(activateMachine.withContext({ ...activateMachine.context, monsters }), { name: 'main', devTools: true });
  return (
    <main style={{ padding: 20 }}>
      <MonsterActivate send={send} active={state.value === 'active'} />
      {state.value === 'active' && (
        <>
          <MonsterChoice onSelect={(monsterId) => send({ type: 'PICK_BOI', payload: { monsterUrl: state.context.monsters[monsterId] } })} />
          {state.context.monsterUrl && <Monster machine={state.context.monsterRef} monsterUrl={state.context.monsterUrl} />}
        </>
      )}
    </main>
  );
};

export const getStaticProps = async () => {
  const data = new Promise((resolve) => setTimeout(resolve(monsters), 1000));

  return { props: { monsters: await data } };
};

export default Index;
