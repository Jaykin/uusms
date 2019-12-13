// 工具页
<template>
  <div class='tool'>
    <el-button type='primary' @click='handleCreateGame'>创建单项赛</el-button>
  </div>
</template>

<script>
import gameApi from '@/model/game'

export default {
  name: 'Tool',
  methods: {
    handleCreateGame () {
      const t = +new Date()
      let game = {}

      // 比赛基本信息
      game.gameTypeId = 1 // 表面是羽毛球比赛，以后给其他类型比赛时可用
      game.name = `Jay的单项赛测试_${t}`
      game.maxJoinCnt = 100 // 最大接受报名数
      game.lastJoinTm = '2020-08-18 12:00:00' // 设置报名截止时间
      game.playTm = '2020-08-18 12:00:00' // 设置开始比赛时间
      game.endTm = '2020-09-18 12:00:00' // 设置比赛结束时间
      game.cost = 0 // 参数费用，以分为单位，200元，写成 20000
      game.bail = 0 // 保证金，以分为单位，200元，写成 20000
      game.addr = '比赛地址'
      game.gpsLat = 23.123 // GPS 经度
      game.gpsLong = 123.345 // GPS 纬度
      game.mark = '赛事描述'
      game.passCode = '' // 加入暗号

      // 添加比赛规则
      let gameSetting = []
      let orgType = {}
      orgType.type = 1 // 组织规则
      orgType.valInt = 2 // 1-团体赛 2-单项赛
      gameSetting.push(orgType)

      let processType = {}
      processType.type = 2 // 进程规则
      processType.valInt = 5 // 分组循环排位赛
      gameSetting.push(processType)

      let scoreType = {}
      scoreType.type = 3 // 积分规则
      scoreType.valInt = 1 // 负积分
      scoreType.valInt2 = 2 // 赢积分
      scoreType.valInt3 = 0 // 弃权积分
      gameSetting.push(scoreType)

      let sortType = {}
      sortType.type = 4 // 排名优先规则
      sortType.valStr = 'ABCDEFGHIJK'
      gameSetting.push(sortType)

      let schedType = {}
      schedType.type = 5 // 对阵规则
      schedType.subType = 1 // 循环阶段对阵规则
      schedType.valInt = 2 // 追分赛制
      schedType.valInt2 = 1 // 同时换人
      gameSetting.push(schedType)

      let schedType1 = {}
      schedType1.type = 5 // 对阵规则
      schedType1.subType = 2 // 循环阶段对阵规则
      schedType1.valInt = 3 // 总分赛制
      gameSetting.push(schedType1)

      let itemType = {}
      itemType.type = 6 // 比赛单项
      itemType.subType = 1 // 循环阶段的单项
      itemType.valInt = 1 // 1局
      itemType.valInt2 = (31 << 16) | 21 // valInt[0:15] 放单项分数， 比如21分, valInt[16:31] 放单项最大比分，比如31，最大分
      itemType.valInt3 = 1 // 2个选手，双打类型
      itemType.valStr = '男单' // 单项名称，表示男双
      gameSetting.push(itemType)

      game.gsList = gameSetting
      gameApi.createSingleGame({
        gameStr: JSON.stringify(game)
      })
    }
  }
}
</script>
