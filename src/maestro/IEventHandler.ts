import IEvent from './IEvent';

export default interface IEventHandler {
  (event: IEvent): void;
}
