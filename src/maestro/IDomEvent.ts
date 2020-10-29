import VDomNode from './VDomNode';
import IEventHandler from './IEventHandler';

export default interface IDomEvent {
  target: VDomNode;
  propName: string;
  callback: IEventHandler;
}
