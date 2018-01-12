export class PermalinkBuildError extends Error {
  constructor(message, item) {
    super(message);
    Error.captureStackTrace(this, PermalinkBuildError);
    this.item = item;
  }
}
