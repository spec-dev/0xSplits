import { LiveObject, Spec, Property, Call, OnCall, Event, OnEvent, Address, BigInt, Timestamp, ZERO_ADDRESS } from '@spec.dev/core'

/**
 * A split contract on the 0xSplits protocol.
 */
@Spec({ 
    uniqueBy: ['address', 'chainId'] 
})
class Split extends LiveObject {
    // Address of the split contract.
    @Property()
    address: Address

    // Fee paid to cover gas distribution.
    @Property()
    distributorFee: BigInt

    // Address of the controller.
    @Property()
    controller: Address

    // Controller assumed during transfer.
    @Property({ default: ZERO_ADDRESS })
    newPotentialController: Address

    // When the split was created.
    @Property()
    createdAt: Timestamp

    // ==== Call Handlers ===================

    @OnCall('0xsplits.SplitMain.createSplit')
    onCreateSplit(call: Call) {
        this.address = call.outputs.split
        this.distributorFee = BigInt.from(call.inputs.distributorFee)
        this.controller = call.inputs.controller
        this.createdAt = this.blockTimestamp
    }

    @OnCall('0xsplits.SplitMain.updateSplit')
    onUpdateSplit(call: Call) {
        this.address = call.outputs.split
        this.distributorFee = BigInt.from(call.inputs.distributorFee)
    }

    // ==== Event Handlers ==================

    @OnEvent('0xsplits.SplitMain.InitiateControlTransfer')
    onInitiateControlTransfer(event: Event) {
        this.address = event.data.split
        this.newPotentialController = event.data.newPotentialController
    }

    @OnEvent('0xsplits.SplitMain.ControlTransfer')
    async onControlTransfer(event: Event) {
        this.address = event.data.split
        if (!(await this.load())) return false
        this.controller = event.data.newController
        this.newPotentialController = ZERO_ADDRESS
    }
}

export default Split