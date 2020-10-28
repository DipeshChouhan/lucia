import DomNode from './DomNode';
import IEventHandler from './IEventHandler';

export default interface IDomEvent {
  target: DomNode;
  propName: string;
  callback: IEventHandler;
}