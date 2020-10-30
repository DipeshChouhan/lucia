import VNode from './VNode';
import IEventHandler from './IEventHandler';

export default interface IEvent {
  target: VNode;
  propName: string;
  callback: IEventHandler;
}
