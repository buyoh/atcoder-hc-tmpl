import React from 'react';
import { connect } from 'react-redux';
import { ReduxStoreState, ReduxStoreDispatch } from '../stores/stores';
import { updateHistoryAsync } from '../stores/App/slices';

// ------------------------------------

type Props = {};

type State = {};

type StateProps = {
  testcases: { path: string; title: string }[];
};

type DispatchProps = {
  updateHistory: () => void;
};

type CombinedProps = Props & StateProps & DispatchProps;

function mapStateToProps(state: ReduxStoreState): StateProps {
  return {
    testcases: state.app.testcases,
  };
}

function mapDispatchToProps(dispatch: ReduxStoreDispatch): DispatchProps {
  return {
    updateHistory: () => {
      dispatch(updateHistoryAsync());
    },
  };
}

// ------------------------------------

class TestCaseList extends React.Component<CombinedProps, State> {
  constructor(props: CombinedProps) {
    super(props);
    this.state = {};
  }

  render(): JSX.Element {
    return (
      <ul className="menu bg-base-200 w-56 rounded-box">
        {this.props.testcases.map((testcase) => {
          return (
            <li key={testcase.path}>
              <a>{testcase.title}</a>
            </li>
          );
        })}
      </ul>
    );
  }
}

// ------------------------------------

export default connect<StateProps, DispatchProps, Props, ReduxStoreState>(
  mapStateToProps,
  mapDispatchToProps
)(TestCaseList);
