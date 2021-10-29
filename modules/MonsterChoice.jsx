const buttonStyle = { cursor: 'pointer', marginBottom: 10, borderRadius: 4, width: 200, backgroundColor: 'white', border: '2px solid black', padding: '10px 20px' };

const MonsterChoice = ({ onSelect, monsterId }) => (
  <section style={{ marginTop: 10, width: '100%', display: 'flex', justifyContent: 'center' }}>
    <div style={{ borderRadius: 10, backgroundColor: 'teal', display: 'flex', flexDirection: 'column', padding: 40, width: 500, justifyContent: 'center', alignItems: 'center' }}>
    <h1>{`${monsterId ? 'Change Em' : 'Pick Em'}`}</h1>
      <button disabled={monsterId === 'pink-boi'} style={buttonStyle} onClick={() => onSelect('pink-boi')}>
        {'Pink Monster'}
      </button>
      <button disabled={monsterId === 'orange-boi'} style={buttonStyle} onClick={() => onSelect('orange-boi')}>
        {'Orange Monster'}
      </button>
    </div>
  </section>
);

export default MonsterChoice;
