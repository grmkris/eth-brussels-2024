import { newMockEvent } from "matchstick-as"
import { ethereum, Address, Bytes, BigInt } from "@graphprotocol/graph-ts"
import {
  OperatorRegistered,
  OperatorUnregistered,
  OwnershipTransferred,
  Paused,
  Transferred,
  Unpaused
} from "../generated/Transfers/Transfers"

export function createOperatorRegisteredEvent(
  operator: Address,
  feeDestination: Address
): OperatorRegistered {
  let operatorRegisteredEvent = changetype<OperatorRegistered>(newMockEvent())

  operatorRegisteredEvent.parameters = new Array()

  operatorRegisteredEvent.parameters.push(
    new ethereum.EventParam("operator", ethereum.Value.fromAddress(operator))
  )
  operatorRegisteredEvent.parameters.push(
    new ethereum.EventParam(
      "feeDestination",
      ethereum.Value.fromAddress(feeDestination)
    )
  )

  return operatorRegisteredEvent
}

export function createOperatorUnregisteredEvent(
  operator: Address
): OperatorUnregistered {
  let operatorUnregisteredEvent = changetype<OperatorUnregistered>(
    newMockEvent()
  )

  operatorUnregisteredEvent.parameters = new Array()

  operatorUnregisteredEvent.parameters.push(
    new ethereum.EventParam("operator", ethereum.Value.fromAddress(operator))
  )

  return operatorUnregisteredEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createPausedEvent(account: Address): Paused {
  let pausedEvent = changetype<Paused>(newMockEvent())

  pausedEvent.parameters = new Array()

  pausedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )

  return pausedEvent
}

export function createTransferredEvent(
  operator: Address,
  id: Bytes,
  recipient: Address,
  sender: Address,
  spentAmount: BigInt,
  spentCurrency: Address
): Transferred {
  let transferredEvent = changetype<Transferred>(newMockEvent())

  transferredEvent.parameters = new Array()

  transferredEvent.parameters.push(
    new ethereum.EventParam("operator", ethereum.Value.fromAddress(operator))
  )
  transferredEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromFixedBytes(id))
  )
  transferredEvent.parameters.push(
    new ethereum.EventParam("recipient", ethereum.Value.fromAddress(recipient))
  )
  transferredEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )
  transferredEvent.parameters.push(
    new ethereum.EventParam(
      "spentAmount",
      ethereum.Value.fromUnsignedBigInt(spentAmount)
    )
  )
  transferredEvent.parameters.push(
    new ethereum.EventParam(
      "spentCurrency",
      ethereum.Value.fromAddress(spentCurrency)
    )
  )

  return transferredEvent
}

export function createUnpausedEvent(account: Address): Unpaused {
  let unpausedEvent = changetype<Unpaused>(newMockEvent())

  unpausedEvent.parameters = new Array()

  unpausedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )

  return unpausedEvent
}
