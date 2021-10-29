const buttonStyle = { cursor: 'pointer', marginBottom: 10, borderRadius: 4, width: 200, backgroundColor: 'white', border: '2px solid black', padding: '10px 20px' };

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

export default MonsterActivate;
