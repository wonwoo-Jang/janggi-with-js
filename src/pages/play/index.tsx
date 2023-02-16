import JanggiBoard from '@components/Janggi/JanggiBoard';
import Layout from '@components/layout/Layout';

export default function PlayPage() {
  return (
    <Layout>
      <div>
        <span>this is play page</span>
        <JanggiBoard />
      </div>
    </Layout>
  );
}
