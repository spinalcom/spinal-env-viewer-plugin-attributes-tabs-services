
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
  EQUIPMENT_TYPE,
  BUILDING_RELATION,
  FLOOR_RELATION,
  ZONE_RELATION,
  ROOM_RELATION,
  EQUIPMENT_RELATION
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
  constructor() {
    this.itemLst = []
  }
  initItem(node, context) {
    let realNode = SpinalGraphService.getRealNode(node.id.get());
    let realContext = SpinalGraphService.getRealNode(context.id.get());
    return realNode.findInContext(realContext,
      function (node) {
        if (node.info.type.get() === ROOM_TYPE || node.info.type.get() === EQUIPMENT_TYPE) {
          return true;
        }
      }).then(lst => {
        this.itemLst = lst
        return lst
      })
  }
  getList(node, context) {
    return this.initItem(node, context).then((lst) => {
      let list = []
      let listProm = []
      for (let i = 0; i < lst.length; i++) {
        const element = lst[i];
        let obj = {
          name: element.info.name.get(),
          id: element.info.id.get(),
          attributes: ""
        }
        let resPromise = this.getSpatialInfo(element).then(infoSpatial => {
          obj.infoSpatial = infoSpatial
          if (obj.infoSpatial != undefined) {
            list.push(obj)
          } else {
            obj.infoSpatial = { building: { id: null, name: null }, floor: { id: null, name: null }, room: { id: null, name: null } }
            list.push(obj)
          }
        })
        listProm.push(resPromise)
      }
      return Promise.all(listProm).then(() => {
        return list;
      })

    })
  }
  getSpatialInfo(node) {
    let obj = {
      building: "",
      floor: "",
      room: ""
    }
    if (node.info.type.get() == EQUIPMENT_TYPE) {
      // get room -> floor -> building
      return this.getRoomFromNode(node).then((room) => {
        return this.getFloorFromRoomNode(room).then(floor => {
          return this.getBuildingFromFloorNode(floor).then(building => {
            if (building != undefined) {
              obj.building = {
                name: building.info.name.get(),
                id: building.info.id.get()
              }
              obj.floor = {
                name: floor.info.name.get(),
                id: floor.info.id.get()
              }
              obj.room = {
                name: room.info.name.get(),
                id: room.info.id.get()
              }
              return obj
            }
          })
        })
      })
    } else if (node.info.type.get() == ROOM_TYPE) {
      // get floor -> building
      return this.getFloorFromRoomNode(node).then(floor => {
        return this.getBuildingFromFloorNode(floor).then(building => {
          obj.building = {
            name: building.info.name.get(),
            id: building.info.id.get()
          }
          obj.floor = {
            name: floor.info.name.get(),
            id: floor.info.id.get()
          }
          return obj
        })
      })
    }

  }
  getBuildingFromFloorNode(node) {
    return node.getParents([FLOOR_RELATION]).then(parents => {
      for (let i = 0; i < parents.length; i++) {
        const element = parents[i];
        if (element.info.type.get() === BUILDING_TYPE) {
          return element
        }
      }
    })
  }
  getFloorFromRoomNode(node) {
    return node.getParents([ROOM_RELATION, ZONE_TYPE]).then(parents => {
      for (let i = 0; i < parents.length; i++) {
        const element = parents[i];
        if (element.info.type.get() === FLOOR_TYPE) {
          return element
        } else {
          // if his parents is zone, floor can be the parents of zone, we have to check it
          // return element.getParents([ZONE_TYPE]).then(parents => {
          //   for (let i = 0; i < parents.length; i++) {
          //     const element = parents[i];
          //     if (element.info.type.get() === FLOOR_TYPE) {
          //       return element
          //     }
          //   }
          // })
        }
      }
    })
  }
  getRoomFromNode(node) {
    return node.getParents([EQUIPMENT_RELATION]).then(parents => {
      for (let i = 0; i < parents.length; i++) {
        const element = parents[i];
        if (element.info.type.get() === ROOM_TYPE) {
          return element
        }
      }
    })
  }
  addGroupLabelList(nodeModel) {
    console.log(nodeModel);
    //let nodeElement = new AppsContextModel(info.title, info.description, userLst, roleLst, info.selectedContext, info.selectedScene, filePath)
    let node = SpinalGraphService.createNode({ name: info.title, type: nodeTypeApp }, nodeElement)
    SpinalGraphService.addChildInContext(this.context.info.id.get(), node, this.context.info.id.get(), relationName, relationType)

  }
  getGroupLabelList(nodeModel) {
    console.log(nodeModel);

  }
  updateGroupLabelList(nodeModel) {
    console.log(nodeModel);

  }
  deleteAttrGroupLabelList(nodeModel) {
    console.log(nodeModel);

  }
}
export const tabService = new AttributesTabService();