/* eslint-disable @next/next/no-img-element */
import { useInterpret, useSelector } from '@xstate/react';
import monsters from '../data/monsters.json';

import MonsterActivate from '../modules/MonsterActivate';
import MonsterChoice from '../modules/MonsterChoice';
import Monster from '../modules/Monster';
import Link from '../modules/Link';

import { activateMachine, VIEW_STATES } from '../machines';

const getCurrentState = state => state.value;
const getCurrentMonster = state => state.context.monster;
const getMonsterRef = state => state.context.monsterRef;
const getMonsters = state => state.context.monsters;
const getChildSpinState = state => state.context.monsterRef.getSnapshot().state.value;

const Index = ({ monsters }) => {
  const activeService = useInterpret(activateMachine.withContext({ ...activateMachine.context, monsters }), { name: 'main', devTools: true });
  const stateValue = useSelector(activeService, getCurrentState);
  const currentMonster = useSelector(activeService, getCurrentMonster);
  const monsterRef = useSelector(activeService, getMonsterRef);
  const monsterChoices = useSelector(activeService, getMonsters);
  const childSpinState = useSelector(activeService, getChildSpinState);

  const selectMonster = monsterId => activeService.send({ type: 'PICK_MONSTER', payload: { id: monsterId, url: monsterChoices[monsterId] } });

  return (
    <main style={{ padding: 20, textAlign: 'center' }}>
      <h1>{`Monster is currently: ${childSpinState}`}</h1>
      <MonsterActivate send={activeService.send} active={stateValue === VIEW_STATES.ACTIVE} />
      {stateValue === VIEW_STATES.ACTIVE && (
        <>
          {currentMonster && <MonsterChoice monsterId={currentMonster.id} onSelect={selectMonster} />}
          {currentMonster.url && <Monster machine={monsterRef} monsterUrl={currentMonster.url} />}
          <Link />
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
