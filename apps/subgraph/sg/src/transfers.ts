import {
  OperatorRegistered as OperatorRegisteredEvent,
  OperatorUnregistered as OperatorUnregisteredEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  Paused as PausedEvent,
  Transferred as TransferredEvent,
  Unpaused as UnpausedEvent
} from "../generated/Transfers/Transfers"
import {
  OperatorRegistered,
  OperatorUnregistered,
  OwnershipTransferred,
  Paused,
  Transferred,
  Unpaused
} from "../generated/schema"

export function handleOperatorRegistered(event: OperatorRegisteredEvent): void {
  let entity = new OperatorRegistered(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.operator = event.params.operator
  entity.feeDestination = event.params.feeDestination

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOperatorUnregistered(
  event: OperatorUnregisteredEvent
): void {
  let entity = new OperatorUnregistered(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.operator = event.params.operator

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handlePaused(event: PausedEvent): void {
  let entity = new Paused(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.account = event.params.account

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTransferred(event: TransferredEvent): void {
  let entity = new Transferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.operator = event.params.operator
  entity.Transfers_id = event.params.id
  entity.recipient = event.params.recipient
  entity.sender = event.params.sender
  entity.spentAmount = event.params.spentAmount
  entity.spentCurrency = event.params.spentCurrency

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleUnpaused(event: UnpausedEvent): void {
  let entity = new Unpaused(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.account = event.params.account

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
