const buttonStyle = { cursor: 'pointer', marginBottom: 10, borderRadius: 4, width: 200, backgroundColor: 'white', border: '2px solid black', padding: '10px 20px' };

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

export default MonsterChoice;