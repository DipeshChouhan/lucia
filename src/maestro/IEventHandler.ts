import IDomEvent from "./IDomEvent";

export default interface IEventHandler {
  (event: IDomEvent): void;
}