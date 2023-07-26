import { LiveObject, Spec, Property, Call, OnCall, Address, BigInt } from '@spec.dev/core'

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

    // ==== Call Handlers ===================

    @OnCall('0xsplits.SplitMain.createSplit')
    onCreateSplit(call: Call) {
        this.address = call.outputs.split
        this.distributorFee = BigInt.from(call.inputs.distributorFee)
        this.controller = call.inputs.controller
    }
}

export default Split