import { useRouter } from "next/router";
const Link = () => {
  const router = useRouter();
  const buttonStyle = { cursor: 'pointer', marginBottom: 10, borderRadius: 4, width: 200, backgroundColor: 'white', border: '2px solid black', padding: '10px 20px' };
  return (
    <section style={{ marginTop: 10, width: '100%', display: 'flex', justifyContent: 'center' }}>
      <div style={{ borderRadius: 10, backgroundColor: 'teal', display: 'flex', flexDirection: 'column', padding: 40, width: 500, justifyContent: 'center', alignItems: 'center' }}>
        <h1>{'Router'}</h1>
        <button style={buttonStyle} onClick={() => router.push('/success')}>
          {'Route Away'}
        </button>
      </div>
    </section>
  );
};

export default Link;
