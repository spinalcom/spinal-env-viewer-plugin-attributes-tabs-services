

const graphservice = require('spinal-env-viewer-graph-service');
const SpinalGraphService = graphservice.SpinalGraphService;

import {
  ROOMS_CATEGORY_RELATION,
  ROOMS_TO_ELEMENT_RELATION,
  ROOMS_GROUP_RELATION,
  EQUIPMENTS_CATEGORY_RELATION,
  EQUIPMENTS_TO_ELEMENT_RELATION,
  EQUIPMENTS_GROUP_RELATION,
  ROOMS_GROUP_CONTEXT,
  ROOMS_GROUP,
  ROOMS_CATEGORY,
  EQUIPMENTS_GROUP_CONTEXT,
  EQUIPMENTS_CATEGORY,
  EQUIPMENTS_GROUP
} from 'spinal-env-viewer-room-manager/js/service'
import {
  SITE_TYPE,
  BUILDING_TYPE,
  FLOOR_TYPE,
  ZONE_TYPE,
  ROOM_TYPE,
  EQUIPMENT_TYPE
} from 'spinal-env-viewer-context-geographic-service/build/constants'

const SELECTrelationList = [
  "hasBIMObject", "hasBimObject",
  ROOMS_CATEGORY_RELATION,
  ROOMS_TO_ELEMENT_RELATION,
  ROOMS_GROUP_RELATION,
  EQUIPMENTS_CATEGORY_RELATION,
  EQUIPMENTS_TO_ELEMENT_RELATION,
  EQUIPMENTS_GROUP_RELATION
]

// var spinalCore = require('spinalcore');
class AttributesTabService {
  constructor() { }
  getItemOfGroup(nodeId) {
    console.log(nodeId)
    let realNode = SpinalGraphService.getRealNode(nodeId);
    realNode.find(SELECTrelationList,
      function (node) {
        if (node.info.type.get() === ROOM_TYPE || node.info.type.get() === EQUIPMENT_TYPE) {
          return true;
        }
      }).then(lst => {
        console.log(lst);

      })
  }


}
export const attributesTabService = new AttributesTabService();