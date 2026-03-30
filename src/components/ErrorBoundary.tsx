import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen bg-white flex items-center justify-center p-6">
          <div className="max-w-sm w-full">
            <h2 className="text-red-600 font-bold text-lg mb-3">エラーが発生しました</h2>
            <pre className="text-xs text-gray-600 bg-gray-100 rounded-lg p-3 overflow-auto whitespace-pre-wrap break-all">
              {this.state.error.message}
              {'\n\n'}
              {this.state.error.stack}
            </pre>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
