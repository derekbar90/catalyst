import { connect } from 'react-redux';
import { dispatchers } from '../AuthFields/store';

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
  actions: {
    logout: () => dispatch(dispatchers.signOut())
  }
});

export default comp =>
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(comp);
