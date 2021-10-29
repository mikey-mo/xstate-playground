/* eslint-disable @next/next/no-img-element */
import { useInterpret, useMachine, useSelector } from '@xstate/react';
import monsters from '../data/monsters.json';

import MonsterActivate from '../common/MonsterActivate';
import MonsterChoice from '../common/MonsterChoice';
import Monster from '../common/Monster';

import { activateMachine } from '../machines';

const getCurrentState = state => state.value;
const getCurrentMonster = state => state.context.monster;
const getMonsterRef = state => state.context.monsterRef;
const getMonsters = state => state.context.monsters;
const getChildSpinState = state => state.context.monsterRef.state.value;

const Index = ({ monsters }) => {
  const activeService = useInterpret(activateMachine.withContext({ ...activateMachine.context, monsters }), { name: 'main', devTools: true });
  const stateValue = useSelector(activeService, getCurrentState);
  const currentMonster = useSelector(activeService, getCurrentMonster);
  const monsterRef = useSelector(activeService, getMonsterRef);
  const monsterChoices = useSelector(activeService, getMonsters);
  const childSpinState = useSelector(activeService, getChildSpinState);

  const selectMonster = monsterId => activeService.send({ type: 'PICK_MONSTER', payload: { monster: monsterChoices[monsterId] } });

  return (
    <main style={{ padding: 20, textAlign: 'center' }}>
      <h1>{`Monster is currently: ${childSpinState}`}</h1>
      <MonsterActivate send={activeService.send} active={stateValue === 'active'} />
      {stateValue === 'active' && (
        <>
          <MonsterChoice active={currentMonster} onSelect={selectMonster} />
          {currentMonster && <Monster machine={monsterRef} monster={currentMonster} />}
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
