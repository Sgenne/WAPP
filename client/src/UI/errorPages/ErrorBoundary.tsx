import { Component } from "react";

export default class ErrorBoundary extends Component<
  { children: JSX.Element },
  { error: Error | undefined }
> {
  constructor(props: { children: JSX.Element }) {
    super(props);
    this.state = {
      error: undefined,
    };
  }

  componentDidCatch(error: Error) {
    this.setState({
      error: error,
    });
  }

  homeButtonClickHandler() {
    window.location.href = "http://localhost:3000";
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div className="error-boundary">
        <h1 className="error-boundary__header">Umm... This is akward...</h1>
        <h3 className="error-boundary__sub-header">An error has occured.</h3>
        <p className="error-boundary__description">
          {this.state.error.message}
        </p>
        <button onClick={this.homeButtonClickHandler}>Go to homepage</button>
      </div>
    );
  }
}
