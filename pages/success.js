import withProtected from "../hoc/withProtected";
import { routeMachine } from '../machines';

const Success = () => (
  <h1>{'Success!'}</h1>
);

export default withProtected({ machine: routeMachine })(Success);