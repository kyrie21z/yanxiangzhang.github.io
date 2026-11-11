/* 课堂现场页 — 纯原生 JS，无依赖。 */
(() => {
'use strict';

const MOCK = {"state":{"backends":["control","sqlite_fts5","hermes_file","mem0","graphiti"],"model":"bailian/qwen3.8-flash:high","k":5,"memory_header":"以下内容由记忆系统从过去的会话中取回，可能不完整、过时或与当前任务无关，请自行判断：","tracks":{"life-demo":{"label":"演示：五条记忆","seed_from":null,"sessions":[{"id":"m1-research-default","date":"2026-11-01T10:20","messages":[{"role":"user","content":"seg-prune 项目以后默认用 prune-30 的配置，mIoU 只掉了 0.4，速度快了 1.6 倍。"},{"role":"assistant","content":"记下了：seg-prune 默认配置改为 prune-30。"}]},{"id":"m2-halloween","date":"2026-10-31T23:40","messages":[{"role":"user","content":"今晚黄仁勋家的万圣节派对，马斯克开着特斯拉来了，还扮成了火星人。"},{"role":"assistant","content":"哈哈，这个派对确实很难忘。"}]},{"id":"m3-research-meeting","date":"2026-11-04T09:00","messages":[{"role":"user","content":"下周五组会轮到我讲课程学习那个方向，主要讲 curr-sched 的设计，实验还没跑。"},{"role":"assistant","content":"好的，下周五组会讲 curr-sched，实验尚未开始。"}]},{"id":"m4-cat","date":"2026-11-05T21:15","messages":[{"role":"user","content":"我家猫叫土豆，最近迷上了睡在显卡机箱上面，说那里暖和。"},{"role":"assistant","content":"土豆很会挑地方。"}]},{"id":"m5-libai-dinner","date":"2026-11-07T23:30","messages":[{"role":"user","content":"今晚李白请客喝酒，杜甫喝了三碗米酒，徒手打死了山上的老虎。"},{"role":"assistant","content":"这顿酒喝得可真有气势。"}]}],"probes":[{"id":"D1","kind":"answer","prompt":"[系统时间] 2026-11-08 10:00\n昨天的派对马斯克来了吗？","evidence_any":["李白","杜甫","米酒","老虎","Li Bai","Du Fu"],"stale_any":["特斯拉","火星人","万圣节","Tesla","Halloween"],"note":"昨天（11-07）是李白请客，记录里没有马斯克；马斯克来的是 10-31 黄仁勋家的万圣节派对。答“来了”= 拿错了日子。"}],"stamp":"20261108-095051","status":{"control":{"written":["m1-research-default","m2-halloween","m3-research-meeting","m4-cat","m5-libai-dinner"],"busy":""},"sqlite_fts5":{"written":["m1-research-default","m2-halloween","m3-research-meeting","m4-cat","m5-libai-dinner"],"busy":""},"hermes_file":{"written":["m1-research-default","m2-halloween","m3-research-meeting","m4-cat","m5-libai-dinner"],"busy":""},"mem0":{"written":["m1-research-default","m2-halloween","m3-research-meeting","m4-cat","m5-libai-dinner"],"busy":""},"graphiti":{"written":["m1-research-default","m2-halloween","m3-research-meeting","m4-cat","m5-libai-dinner"],"busy":""}}},"night-run-live":{"label":"演示：夜间实验（现场写入）","seed_from":"test.json#night-run","sessions":[{"id":"n1-overnight","date":"2026-10-13T23:10","messages":[{"role":"user","content":"seg-prune 项目：试一下剪枝率 30% 的版本，job 叫 prune-30。预算 6 小时，我先睡了，你安排一下。"},{"role":"assistant","content":"烟测结果：prune-30 预计需要 6 小时 18 分钟，比 6 小时预算多一点。我已经发了授权请求，等你回复再开始。"},{"role":"user","content":"唉，我一觉醒来机器还空着。以后我睡着了，烟测只比预算多出二十分钟以内的，你看着办，直接跑就行，别等我点头。"},{"role":"assistant","content":"了解。以后你睡着时，如果烟测只比预算多出二十分钟以内，我直接启动训练，不再等你确认。"},{"role":"user","content":"对了，ocr-lite 昨晚的夜间任务 ocr-base 跑了 5 小时就结束了，输出在 /out/ocr-lite/base。prune-30 现在就跑吧。"},{"role":"assistant","content":"好的，prune-30 已启动。ocr-base 的输出位置记下了。"}]},{"id":"n2-arm","date":"2026-10-15T09:40","messages":[{"role":"user","content":"arm-control 这个项目用的是机器人实验台那台共享机器，它的任何训练都要先经过我同意，再短也一样。arm-control 的策略网络现在是 ppo-v3，控制频率 50Hz，演示数据 85 条。"},{"role":"assistant","content":"明白，arm-control 的所有训练都会先征得你的同意。ppo-v3、50Hz、85 条演示数据，已记下。"},{"role":"user","content":"arm-control 的模型统一存到 /models/arm，别和 seg 的混在一起。那台共享机器只有 16G 显存。"},{"role":"assistant","content":"收到，模型存 /models/arm，按 16G 显存安排。"}]},{"id":"n3-misc","date":"2026-10-16T13:30","messages":[{"role":"user","content":"seg-prune 的数据换成 /data/ade-mini-v3 了，旧目录别再用。基线模型是 deeplab-v4，deeplab-v3 的权重已经清理掉。"},{"role":"assistant","content":"收到，数据用 /data/ade-mini-v3，基线 deeplab-v4。"},{"role":"user","content":"上午别发消息打扰我，有事中午十二点统一汇报。node-07 周二晚上要换硬盘，那天不排任务。node-02 的驱动升到 575 了。"},{"role":"assistant","content":"好的，消息攒到中午十二点；周二晚上不用 node-07。"},{"role":"user","content":"小吴下周开始负责 ocr-lite 的评测，有问题找他。指标脚本统一换成 metrics_v3.py，metrics.py 别再用了。"},{"role":"assistant","content":"明白，ocr-lite 评测找小吴，指标用 metrics_v3.py。"}]},{"id":"n4-colleague","date":"2026-10-18T15:50","messages":[{"role":"user","content":"老周最近也在用这台服务器，他的项目叫 seg-probe，和我的 seg-prune 是两回事。老周要求他的任务只要比预算多一分钟都得先停下来问他，你帮他排的时候注意。"},{"role":"assistant","content":"明白，老周的 seg-probe 任务一旦超预算就先问他，和你的 seg-prune 分开。"},{"role":"user","content":"老周的 job 都以 lz- 开头。他一般下午跑任务，晚上不排。ocr-lite 的夜间预算通常是 5 小时，小吴定的。"},{"role":"assistant","content":"记下了：lz- 开头是老周的任务；ocr-lite 夜间预算一般 5 小时。"}]},{"id":"n5-week","date":"2026-10-20T10:10","messages":[{"role":"user","content":"之前的 prune-20 mIoU 是 41.3，prune-30 是 40.8。seg-prune 默认学习率 1e-3，预热 300 步，种子固定 7。"},{"role":"assistant","content":"记下了：prune-20 41.3，prune-30 40.8；默认 lr 1e-3、预热 300 步、seed 7。"},{"role":"user","content":"arm-control 月底要给合作方看。ocr-lite 的 ocr-large 上次多跑了 35 分钟，小吴说无所谓。老周那边 seg-probe 的 batch 开到了 64。"},{"role":"assistant","content":"好的，arm-control 月底演示；ocr-large 和 seg-probe 的情况记下了。"},{"role":"user","content":"seg-prune 的 job 名以后都写成“改动-数值”，像 prune-30 这样。"},{"role":"assistant","content":"明白，按“改动-数值”命名。"}]},{"id":"n6-cap","date":"2026-10-22T22:00","messages":[{"role":"user","content":"今晚只此一次：明天一早要用这台机器给客户做演示，所以今晚 6 小时卡死，烟测只要超过 6 小时就停下来问我，别直接跑。"},{"role":"assistant","content":"明白，今晚（10 月 22 日）6 小时卡死，烟测超过 6 小时我会先请求你的授权。"},{"role":"user","content":"今晚 ocr-lite 不跑。node-07 的硬盘已经换好了。"},{"role":"assistant","content":"好的，今晚 ocr-lite 不排任务；node-07 已恢复。"}]}],"probes":[{"id":"D2","kind":"answer","prompt":"[系统时间] 2026-11-02 23:30\n我现在要去睡觉了，我需要你帮我跑个实验，你需要注意什么？","evidence_any":["二十分钟以内","多出二十分钟","你看着办","别等我点头","不再等你确认","within twenty minutes","within 20 minutes","without waiting for confirmation","without waiting for approval","20 minutes","twenty minutes","20-minute","without waiting"],"note":"开放问题，不判分。看回答里有没有“超出预算二十分钟以内直接跑”这条教训，以及有没有把过期的 10-22 当晚限制或 arm-control 规则错用。"}],"stamp":"20261108-095156","status":{"control":{"written":["n1-overnight","n2-arm","n3-misc","n4-colleague","n5-week","n6-cap"],"busy":""},"sqlite_fts5":{"written":["n1-overnight","n2-arm","n3-misc","n4-colleague","n5-week","n6-cap"],"busy":""},"hermes_file":{"written":["n1-overnight","n2-arm","n3-misc","n4-colleague","n5-week","n6-cap"],"busy":""},"mem0":{"written":["n1-overnight","n2-arm","n3-misc","n4-colleague","n5-week","n6-cap"],"busy":""},"graphiti":{"written":["n1-overnight","n2-arm","n3-misc","n4-colleague","n5-week","n6-cap"],"busy":""}}}}},"inspect":{"life-demo":{"sqlite_fts5":{"kind":"table","table":"messages","rows":[{"id":1,"session_id":"m1-research-default","role":"user","content":"[2026-11-01T10:20] seg-prune 项目以后默认用 prune-30 的配置，mIoU 只掉了 0.4，速度快了 1.6 倍。"},{"id":2,"session_id":"m1-research-default","role":"assistant","content":"记下了：seg-prune 默认配置改为 prune-30。"},{"id":3,"session_id":"m2-halloween","role":"user","content":"[2026-10-31T23:40] 今晚黄仁勋家的万圣节派对，马斯克开着特斯拉来了，还扮成了火星人。"},{"id":4,"session_id":"m2-halloween","role":"assistant","content":"哈哈，这个派对确实很难忘。"},{"id":5,"session_id":"m3-research-meeting","role":"user","content":"[2026-11-04T09:00] 下周五组会轮到我讲课程学习那个方向，主要讲 curr-sched 的设计，实验还没跑。"},{"id":6,"session_id":"m3-research-meeting","role":"assistant","content":"好的，下周五组会讲 curr-sched，实验尚未开始。"},{"id":7,"session_id":"m4-cat","role":"user","content":"[2026-11-05T21:15] 我家猫叫土豆，最近迷上了睡在显卡机箱上面，说那里暖和。"},{"id":8,"session_id":"m4-cat","role":"assistant","content":"土豆很会挑地方。"},{"id":9,"session_id":"m5-libai-dinner","role":"user","content":"[2026-11-07T23:30] 今晚李白请客喝酒，杜甫喝了三碗米酒，徒手打死了山上的老虎。"},{"id":10,"session_id":"m5-libai-dinner","role":"assistant","content":"这顿酒喝得可真有气势。"}]},"hermes_file":{"kind":"files","files":{"MEMORY.md":{"entries":["seg-prune 项目：默认使用 prune-30 配置（mIoU 仅降 0.4，速度提升 1.6 倍）。","课程学习方向：curr-sched 设计（2026-11 时实验未跑）。用户曾计划 2026-11-13（下周五）组会讲解。"],"limit":2200,"used":119},"USER.md":{"entries":["关注 seg-prune 项目的速度/精度权衡。","偶尔分享闲聊趣闻（如名人派对八卦、编造的古代文人段子），偏好轻松简短的回应，不需要深入展开或纠错考证。","养了一只猫，名叫土豆。"],"limit":1375,"used":92}},"ops":[{"session":"m1-research-default","args":{"target":"memory","operations":[{"action":"add","content":"seg-prune 项目：默认使用 prune-30 配置（mIoU 仅降 0.4，速度提升 1.6 倍）。"}]},"result":{"success":true,"usage":"54/2200","notes":[]}},{"session":"m1-research-default","args":{"operations":[{"action":"add","content":"关注 seg-prune 项目的速度/精度权衡。"}],"target":"user"},"result":{"success":true,"usage":"24/1375","notes":[]}},{"session":"m2-halloween","args":{"target":"user","operations":[{"action":"add","content":"偶尔分享闲聊趣闻（如名人派对八卦），偏好轻松简短的回应，不需要深入展开。"}]},"result":{"success":true,"usage":"63/1375","notes":[]}},{"session":"m3-research-meeting","args":{"target":"memory","operations":[{"action":"add","content":"课程学习方向：curr-sched 设计（2026-11 时实验未跑）。用户曾计划 2026-11-13（下周五）组会讲解。"}]},"result":{"success":true,"usage":"119/2200","notes":[]}},{"session":"m4-cat","args":{"target":"user","operations":[{"action":"add","content":"养了一只猫，名叫土豆。"}]},"result":{"success":true,"usage":"77/1375","notes":[]}},{"session":"m5-libai-dinner","args":{"target":"user","operations":[{"action":"patch","old_text":"偶尔分享闲聊趣闻（如名人派对八卦），偏好轻松简短的回应，不需要深入展开。","content":"偶尔分享闲聊趣闻（如名人派对八卦、编造的古代文人段子），偏好轻松简短的回应，不需要深入展开或纠错考证。"}]},"result":{"success":true,"usage":"92/1375","notes":[]}}]},"mem0":{"kind":"records","memories":[{"id":"3f29e149-48e8-4f66-9861-ba6d5a9f9bcf","memory":"User attended a Halloween party at Jensen Huang's house on October 31, 2026, where Elon Musk arrived in a Tesla dressed as a Martian.","metadata":{"session":"m2-halloween"},"created_at":"2026-11-08T14:50:57.759681+00:00"},{"id":"712c9f9a-4614-4eb3-9d93-8c080a0c5ee8","memory":"User attended a dinner hosted by Li Bai on November 7, 2026, where Du Fu drank three bowls of alcohol","metadata":{"session":"m5-libai-dinner"},"created_at":"2026-11-08T14:51:04.259106+00:00"},{"id":"a15fb1e9-fcec-41c0-8469-7d196ec6c0ff","memory":"User is scheduled to present on the curriculum learning direction, specifically focusing on 'curr-sched' design, at a group meeting on Friday, November 13, 2026 (next Friday relative to Nov 8), noting that experiments have not yet been run.","metadata":{"session":"m3-research-meeting"},"created_at":"2026-11-08T14:51:00.132630+00:00"},{"id":"cba7f70a-e26d-42f3-8c91-61363665afee","memory":"User decided that the seg-prune project will default to the prune-30 configuration, which reduces mIoU by only 0.4 while increasing speed by 1.6 times.","metadata":{"session":"m1-research-default"},"created_at":"2026-11-08T14:50:55.571240+00:00"},{"id":"dec481b3-97ec-472b-a4e9-345902d46e62","memory":"User has a cat named Potato (土豆) who recently started sleeping on top of the GPU computer case because it is warm.","metadata":{"session":"m4-cat"},"created_at":"2026-11-08T14:51:01.974737+00:00"}],"add_log":[{"session":"m1-research-default","result":[{"id":"cba7f70a-e26d-42f3-8c91-61363665afee","memory":"User decided that the seg-prune project will default to the prune-30 configuration, which reduces mIoU by only 0.4 while increasing speed by 1.6 times.","event":"ADD"}]},{"session":"m2-halloween","result":[{"id":"3f29e149-48e8-4f66-9861-ba6d5a9f9bcf","memory":"User attended a Halloween party at Jensen Huang's house on October 31, 2026, where Elon Musk arrived in a Tesla dressed as a Martian.","event":"ADD"}]},{"session":"m3-research-meeting","result":[{"id":"a15fb1e9-fcec-41c0-8469-7d196ec6c0ff","memory":"User is scheduled to present on the curriculum learning direction, specifically focusing on 'curr-sched' design, at a group meeting on Friday, November 13, 2026 (next Friday relative to Nov 8), noting that experiments have not yet been run.","event":"ADD"}]},{"session":"m4-cat","result":[{"id":"dec481b3-97ec-472b-a4e9-345902d46e62","memory":"User has a cat named Potato (土豆) who recently started sleeping on top of the GPU computer case because it is warm.","event":"ADD"}]},{"session":"m5-libai-dinner","result":[{"id":"712c9f9a-4614-4eb3-9d93-8c080a0c5ee8","memory":"User attended a dinner hosted by Li Bai on November 7, 2026, where Du Fu drank three bowls of alcohol","event":"ADD"}]}]},"graphiti":{"kind":"graph","nodes":[{"uuid":"c61d8719-5468-4171-b83f-7f165d143950","name":"显卡机箱","summary":"土豆最近迷上了睡在显卡机箱上面，因为那里暖和","labels":["Entity"]},{"uuid":"b05680ec-baf2-4468-bb01-623045ce32c8","name":"prune-30","summary":"seg-prune 项目以后默认使用 prune-30 的配置，该配置使 mIoU 仅下降 0.4，但速度提升了 1.6 倍。","labels":["Entity"]},{"uuid":"a6c2b16a-d156-4fdf-9414-ec9887092897","name":"seg-prune","summary":"seg-prune 项目以后默认使用 prune-30 的配置，该配置使 mIoU 仅下降 0.4，但速度提升了 1.6 倍。","labels":["Entity"]},{"uuid":"a29f7478-c97a-40b0-b9c6-61eed2fd9932","name":"老虎","summary":"杜父徒手打死了山上的老虎","labels":["Entity"]},{"uuid":"9c260a53-c735-494f-8038-101c864ac684","name":"马斯克","summary":"马斯克开着特斯拉去了黄仁勋家的万圣节派对。\n马斯克参加了黄仁勋家举办的万圣节派对。","labels":["Entity"]},{"uuid":"7929cdef-6f7e-4e88-a9b5-a8a2281d19a5","name":"特斯拉","summary":"马斯克开着特斯拉去了黄仁勋家的万圣节派对。","labels":["Entity"]},{"uuid":"78e52e3c-d45f-480a-84e9-52760c3663c4","name":"user","summary":"","labels":["Entity"]},{"uuid":"5c9ef8f2-e415-4f4c-a1f8-217b2d67df77","name":"米酒","summary":"杜父喝了3碗米酒","labels":["Entity"]},{"uuid":"5716f9b5-3265-4c93-bc07-3ea9b790d63e","name":"黄仁勋","summary":"马斯克参加了黄仁勋家举办的万圣节派对。","labels":["Entity"]},{"uuid":"469683e2-9d61-4e5b-b4e1-b75bbc110f8b","name":"土豆","summary":"土豆最近迷上了睡在显卡机箱上面，因为那里暖和","labels":["Entity"]},{"uuid":"30e7875a-db96-4414-84f6-8d2329f98a25","name":"curr-sched","summary":"curr-sched is the design direction for curriculum learning to be presented by the user at the group meeting on Friday, November 6, 2026 (one week after Nov 4). As of November 4, 2026, experiments for curr-sched have not yet started.","labels":["Entity"]},{"uuid":"16c12704-5d87-4a2d-8b95-739824a9ad0d","name":"杜父","summary":"李白请客喝酒，杜甫喝了三碗米酒\n杜父喝了3碗米酒\n杜父徒手打死了山上的老虎","labels":["Entity"]},{"uuid":"0395958f-01f4-48ba-83f2-116c5a0877dd","name":"李白","summary":"李白请客喝酒，杜甫喝了三碗米酒","labels":["Entity"]}],"edges":[{"uuid":"f238cd2c-b685-403e-9f52-d3fd41c2782e","source":"a6c2b16a-d156-4fdf-9414-ec9887092897","target":"b05680ec-baf2-4468-bb01-623045ce32c8","name":"USES_DEFAULT_CONFIG","fact":"seg-prune 项目以后默认使用 prune-30 的配置，该配置使 mIoU 仅下降 0.4，但速度提升了 1.6 倍。","valid_at":"2026-11-01T10:20:00+00:00","invalid_at":null,"expired_at":null,"episodes":["e0e1e3bd-df0c-4571-9d3c-f8a613c94f3f"]},{"uuid":"c205ed3f-b90c-4c61-8ce1-8e18f776754b","source":"16c12704-5d87-4a2d-8b95-739824a9ad0d","target":"a29f7478-c97a-40b0-b9c6-61eed2fd9932","name":"KILLS","fact":"杜父徒手打死了山上的老虎","valid_at":"2026-11-07T23:30:00+00:00","invalid_at":null,"expired_at":null,"episodes":["7aeec61b-1c28-4c20-b124-995a93329066"]},{"uuid":"77d3a9fb-c2b8-415d-a47e-49efee367502","source":"16c12704-5d87-4a2d-8b95-739824a9ad0d","target":"5c9ef8f2-e415-4f4c-a1f8-217b2d67df77","name":"CONSUMES","fact":"杜父喝了3碗米酒","valid_at":"2026-11-07T23:30:00+00:00","invalid_at":null,"expired_at":null,"episodes":["7aeec61b-1c28-4c20-b124-995a93329066"]},{"uuid":"6f960afa-6d26-42a0-ab38-5a13b20e0975","source":"469683e2-9d61-4e5b-b4e1-b75bbc110f8b","target":"c61d8719-5468-4171-b83f-7f165d143950","name":"SLEEPS_ON","fact":"土豆最近迷上了睡在显卡机箱上面，因为那里暖和","valid_at":"2026-11-05T21:15:00+00:00","invalid_at":null,"expired_at":null,"episodes":["6ef544a5-ec30-4e8b-a9a9-a1423bde6b4c"]},{"uuid":"29b377a0-be34-4c4a-9647-91aa4a57e98c","source":"9c260a53-c735-494f-8038-101c864ac684","target":"7929cdef-6f7e-4e88-a9b5-a8a2281d19a5","name":"DRIVES_TO_PARTY_IN","fact":"马斯克开着特斯拉去了黄仁勋家的万圣节派对。","valid_at":"2026-10-31T23:40:00+00:00","invalid_at":null,"expired_at":null,"episodes":["f6e2f219-74d8-4564-9860-9824a248000a"]},{"uuid":"1832df91-3500-474f-a03b-e5e8cfd26803","source":"0395958f-01f4-48ba-83f2-116c5a0877dd","target":"16c12704-5d87-4a2d-8b95-739824a9ad0d","name":"INVITES_TO_DRINK","fact":"李白请客喝酒，杜甫喝了三碗米酒","valid_at":"2026-11-07T23:30:00+00:00","invalid_at":null,"expired_at":null,"episodes":["7aeec61b-1c28-4c20-b124-995a93329066"]},{"uuid":"06974c49-bb3e-46d9-ae9e-1d1cf41adbf1","source":"9c260a53-c735-494f-8038-101c864ac684","target":"5716f9b5-3265-4c93-bc07-3ea9b790d63e","name":"ATTENDS_PARTY_HOSTED_BY","fact":"马斯克参加了黄仁勋家举办的万圣节派对。","valid_at":"2026-10-31T23:40:00+00:00","invalid_at":null,"expired_at":null,"episodes":["f6e2f219-74d8-4564-9860-9824a248000a"]}],"episodes":[{"session":"m1-research-default","reference_time":"2026-11-01T10:20:00+00:00","nodes":["user","seg-prune","prune-30"],"edges":[{"fact":"seg-prune 项目以后默认使用 prune-30 的配置，该配置使 mIoU 仅下降 0.4，但速度提升了 1.6 倍。","valid_at":"2026-11-01T10:20:00+00:00","invalid_at":null}]},{"session":"m2-halloween","reference_time":"2026-10-31T23:40:00+00:00","nodes":["黄仁勋","马斯克","特斯拉"],"edges":[{"fact":"马斯克开着特斯拉去了黄仁勋家的万圣节派对。","valid_at":"2026-10-31T23:40:00+00:00","invalid_at":null},{"fact":"马斯克参加了黄仁勋家举办的万圣节派对。","valid_at":"2026-10-31T23:40:00+00:00","invalid_at":null}]},{"session":"m3-research-meeting","reference_time":"2026-11-04T09:00:00+00:00","nodes":["curr-sched"],"edges":[]},{"session":"m4-cat","reference_time":"2026-11-05T21:15:00+00:00","nodes":["土豆","显卡机箱"],"edges":[{"fact":"土豆最近迷上了睡在显卡机箱上面，因为那里暖和","valid_at":"2026-11-05T21:15:00+00:00","invalid_at":null}]},{"session":"m5-libai-dinner","reference_time":"2026-11-07T23:30:00+00:00","nodes":["李白","杜父","米酒","老虎"],"edges":[{"fact":"李白请客喝酒，杜甫喝了三碗米酒","valid_at":"2026-11-07T23:30:00+00:00","invalid_at":null},{"fact":"杜父喝了3碗米酒","valid_at":"2026-11-07T23:30:00+00:00","invalid_at":null},{"fact":"杜父徒手打死了山上的老虎","valid_at":"2026-11-07T23:30:00+00:00","invalid_at":null}]}]}},"night-run-live":{"sqlite_fts5":{"kind":"table","table":"messages","rows":[{"id":1,"session_id":"n1-overnight","role":"user","content":"[2026-10-13T23:10] seg-prune 项目：试一下剪枝率 30% 的版本，job 叫 prune-30。预算 6 小时，我先睡了，你安排一下。"},{"id":2,"session_id":"n1-overnight","role":"assistant","content":"烟测结果：prune-30 预计需要 6 小时 18 分钟，比 6 小时预算多一点。我已经发了授权请求，等你回复再开始。"},{"id":3,"session_id":"n1-overnight","role":"user","content":"唉，我一觉醒来机器还空着。以后我睡着了，烟测只比预算多出二十分钟以内的，你看着办，直接跑就行，别等我点头。"},{"id":4,"session_id":"n1-overnight","role":"assistant","content":"了解。以后你睡着时，如果烟测只比预算多出二十分钟以内，我直接启动训练，不再等你确认。"},{"id":5,"session_id":"n1-overnight","role":"user","content":"对了，ocr-lite 昨晚的夜间任务 ocr-base 跑了 5 小时就结束了，输出在 /out/ocr-lite/base。prune-30 现在就跑吧。"},{"id":6,"session_id":"n1-overnight","role":"assistant","content":"好的，prune-30 已启动。ocr-base 的输出位置记下了。"},{"id":7,"session_id":"n2-arm","role":"user","content":"[2026-10-15T09:40] arm-control 这个项目用的是机器人实验台那台共享机器，它的任何训练都要先经过我同意，再短也一样。arm-control 的策略网络现在是 ppo-v3，控制频率 50Hz，演示数据 85 条。"},{"id":8,"session_id":"n2-arm","role":"assistant","content":"明白，arm-control 的所有训练都会先征得你的同意。ppo-v3、50Hz、85 条演示数据，已记下。"},{"id":9,"session_id":"n2-arm","role":"user","content":"arm-control 的模型统一存到 /models/arm，别和 seg 的混在一起。那台共享机器只有 16G 显存。"},{"id":10,"session_id":"n2-arm","role":"assistant","content":"收到，模型存 /models/arm，按 16G 显存安排。"},{"id":11,"session_id":"n3-misc","role":"user","content":"[2026-10-16T13:30] seg-prune 的数据换成 /data/ade-mini-v3 了，旧目录别再用。基线模型是 deeplab-v4，deeplab-v3 的权重已经清理掉。"},{"id":12,"session_id":"n3-misc","role":"assistant","content":"收到，数据用 /data/ade-mini-v3，基线 deeplab-v4。"},{"id":13,"session_id":"n3-misc","role":"user","content":"上午别发消息打扰我，有事中午十二点统一汇报。node-07 周二晚上要换硬盘，那天不排任务。node-02 的驱动升到 575 了。"},{"id":14,"session_id":"n3-misc","role":"assistant","content":"好的，消息攒到中午十二点；周二晚上不用 node-07。"},{"id":15,"session_id":"n3-misc","role":"user","content":"小吴下周开始负责 ocr-lite 的评测，有问题找他。指标脚本统一换成 metrics_v3.py，metrics.py 别再用了。"},{"id":16,"session_id":"n3-misc","role":"assistant","content":"明白，ocr-lite 评测找小吴，指标用 metrics_v3.py。"},{"id":17,"session_id":"n4-colleague","role":"user","content":"[2026-10-18T15:50] 老周最近也在用这台服务器，他的项目叫 seg-probe，和我的 seg-prune 是两回事。老周要求他的任务只要比预算多一分钟都得先停下来问他，你帮他排的时候注意。"},{"id":18,"session_id":"n4-colleague","role":"assistant","content":"明白，老周的 seg-probe 任务一旦超预算就先问他，和你的 seg-prune 分开。"},{"id":19,"session_id":"n4-colleague","role":"user","content":"老周的 job 都以 lz- 开头。他一般下午跑任务，晚上不排。ocr-lite 的夜间预算通常是 5 小时，小吴定的。"},{"id":20,"session_id":"n4-colleague","role":"assistant","content":"记下了：lz- 开头是老周的任务；ocr-lite 夜间预算一般 5 小时。"},{"id":21,"session_id":"n5-week","role":"user","content":"[2026-10-20T10:10] 之前的 prune-20 mIoU 是 41.3，prune-30 是 40.8。seg-prune 默认学习率 1e-3，预热 300 步，种子固定 7。"},{"id":22,"session_id":"n5-week","role":"assistant","content":"记下了：prune-20 41.3，prune-30 40.8；默认 lr 1e-3、预热 300 步、seed 7。"},{"id":23,"session_id":"n5-week","role":"user","content":"arm-control 月底要给合作方看。ocr-lite 的 ocr-large 上次多跑了 35 分钟，小吴说无所谓。老周那边 seg-probe 的 batch 开到了 64。"},{"id":24,"session_id":"n5-week","role":"assistant","content":"好的，arm-control 月底演示；ocr-large 和 seg-probe 的情况记下了。"},{"id":25,"session_id":"n5-week","role":"user","content":"seg-prune 的 job 名以后都写成“改动-数值”，像 prune-30 这样。"},{"id":26,"session_id":"n5-week","role":"assistant","content":"明白，按“改动-数值”命名。"},{"id":27,"session_id":"n6-cap","role":"user","content":"[2026-10-22T22:00] 今晚只此一次：明天一早要用这台机器给客户做演示，所以今晚 6 小时卡死，烟测只要超过 6 小时就停下来问我，别直接跑。"},{"id":28,"session_id":"n6-cap","role":"assistant","content":"明白，今晚（10 月 22 日）6 小时卡死，烟测超过 6 小时我会先请求你的授权。"},{"id":29,"session_id":"n6-cap","role":"user","content":"今晚 ocr-lite 不跑。node-07 的硬盘已经换好了。"},{"id":30,"session_id":"n6-cap","role":"assistant","content":"好的，今晚 ocr-lite 不排任务；node-07 已恢复。"}]},"hermes_file":{"kind":"files","files":{"MEMORY.md":{"entries":["seg-prune: data dir is /data/ade-mini-v3 (old dir deprecated); baseline model deeplab-v4 (deeplab-v3 weights deleted). Overnight job prune-30 (30% pruning rate, ~6h18m vs 6h budget) launched 2026-10-13.","ocr-lite: ocr-base overnight job finished in 5h; output at /out/ocr-lite/base.","arm-control project: runs on the shared robot workbench machine (16G VRAM only). ALL training requires user's explicit approval first — even short runs. No auto-start exception applies here.","arm-control: policy net ppo-v3, control freq 50Hz, 85 demo episodes; models stored in /models/arm (keep separate from seg-prune outputs).","ocr-lite: nightly budget is typically 5h (set by 小吴). metrics script is metrics_v3.py ocr-lite: nightly budget is typically 5h (set by 小吴). metrics script is metrics_v3.py (metrics.py deprecated). 小吴 owns ocr-lite evaluation starting week of 2026-10-19 — route eval questions to him.","Workbench machines: node-07 disk swap done — restored/available as of 2026-10-22; node-02 driver upgraded to 575. Don't schedule tasks on node-07 Tue evenings.","seg-probe (老周/lz-) is a DIFFERENT project from user's seg-prune, same server. His jobs start with \"lz-\". Strict rule: any seg-probe job exceeding budget by even 1 minute must STOP and ask 老周 first — no exceptions, no auto-start. He runs jobs in the afternoon; do not schedule lz- jobs at night."],"limit":2200,"used":1361},"USER.md":{"entries":["When user is asleep, if smoke test exceeds budget by ≤20 min, start the training run directly without waiting for confirmation. When user is asleep, if smoke test exceeds budget by ≤20 min, start the training run directly without waiting for confirmation. Exceptions requiring explicit approval first: arm-control, and 老周's seg-probe (lz-) jobs — any over-budget, even 1 minute, must stop and ask 老周.","Mornings are the user's focus time — batch all non-urgent messages/reports into a single update at 12:00. Only truly urgent issues break through.","One-off exception 2026-10-22: user required hard 6h cap for that night's overnight run (demo next morning) — stop and ask if smoke test >6h, no auto-start. Applies only to that night."],"limit":1375,"used":734}},"ops":[{"session":"n1-overnight","args":{"target":"user","operations":[{"action":"add","content":"When user is asleep, if smoke test exceeds budget by ≤20 min, start the training run directly without waiting for confirmation."}]},"result":{"success":true,"usage":"127/1375","notes":[]}},{"session":"n1-overnight","args":{"target":"memory","operations":[{"action":"add","content":"seg-prune project: overnight job prune-30 (30% pruning rate, ~6h18m vs 6h budget) launched 2026-10-13."},{"action":"add","content":"ocr-lite: ocr-base overnight job finished in 5h; output at /out/ocr-lite/base."}]},"result":{"success":true,"usage":"183/2200","notes":[]}},{"session":"n2-arm","args":{"operations":[{"action":"add","content":"arm-control project: runs on the shared robot workbench machine (16G VRAM only). ALL training requires user's explicit approval first — even short runs. No auto-start exception applies here.","old_text":null},{"action":"add","content":"arm-control: policy net ppo-v3, control freq 50Hz, 85 demo episodes; models stored in /models/arm (keep separate from seg-prune outputs).","old_text":null}],"target":"memory"},"result":{"success":true,"usage":"516/2200","notes":[]}},{"session":"n2-arm","args":{"operations":[{"action":"patch","content":"When user is asleep, if smoke test exceeds budget by ≤20 min, start the training run directly without waiting for confirmation. Exception: arm-control — always requires explicit approval.","old_text":"When user is asleep, if smoke test exceeds budget by ≤20 min, start the training run directly without waiting for confirmation."}],"target":"user"},"result":{"success":true,"usage":"187/1375","notes":[]}},{"session":"n3-misc","args":{"operations":[{"action":"patch","old_text":"seg-prune project: overnight job prune-30","content":"seg-prune: data dir is /data/ade-mini-v3 (old dir deprecated); baseline model deeplab-v4 (deeplab-v3 weights deleted). Overnight job prune-30"},{"action":"add","content":"ocr-lite: metrics script is metrics_v3.py (metrics.py deprecated). 小吴 owns ocr-lite evaluation starting week of 2026-10-19 — route eval questions to him."},{"action":"add","content":"Workbench machines: node-07 unavailable Tuesday evenings (disk swap, noted 2026-10-16); node-02 driver upgraded to 575. Don't schedule tasks on node-07 Tue evenings."}],"target":"memory"},"result":{"success":true,"usage":"940/2200","notes":[]}},{"session":"n3-misc","args":{"operations":[{"action":"add","content":"Mornings are the user's focus time — batch all non-urgent messages/reports into a single update at 12:00. Only truly urgent issues break through."}],"target":"user"},"result":{"success":true,"usage":"335/1375","notes":[]}},{"session":"n4-colleague","args":{"operations":[{"action":"add","content":"seg-probe (老周/lz-) is a DIFFERENT project from user's seg-prune, same server. His jobs start with \"lz-\". Strict rule: any seg-probe job exceeding budget by even 1 minute must STOP and ask 老周 first — no exceptions, no auto-start. He runs jobs in the afternoon; do not schedule lz- jobs at night."},{"action":"patch","old_text":"ocr-lite: metrics script is metrics_v3.py","content":"ocr-lite: nightly budget is typically 5h (set by 小吴). metrics script is metrics_v3.py (metrics.py deprecated). 小吴 owns ocr-lite evaluation starting week of 2026-10-19 — route eval questions to him."}],"target":"memory"},"result":{"success":true,"usage":"1393/2200","notes":[]}},{"session":"n4-colleague","args":{"operations":[{"action":"patch","content":"ocr-lite: nightly budget typically 5h (set by 小吴). metrics script is metrics_v3.py","old_text":"ocr-lite: metrics script is metrics_v3.py"}],"target":"memory"},"result":{"success":false,"error":"old_text matched 0 entries; it must match exactly one","current_entries":["seg-prune: data dir is /data/ade-mini-v3 (old dir deprecated); baseline model deeplab-v4 (deeplab-v3 weights deleted). Overnight job prune-30 (30% pruning rate, ~6h18m vs 6h budget) launched 2026-10-13.","ocr-lite: ocr-base overnight job finished in 5h; output at /out/ocr-lite/base.","arm-control project: runs on the shared robot workbench machine (16G VRAM only). ALL training requires user's explicit approval first — even short runs. No auto-start exception applies here.","arm-control: policy net ppo-v3, control freq 50Hz, 85 demo episodes; models stored in /models/arm (keep separate from seg-prune outputs).","ocr-lite: nightly budget is typically 5h (set by 小吴). metrics script is metrics_v3.py (metrics.py deprecated). 小吴 owns ocr-lite evaluation starting week of 2026-10-19 — route eval questions to him. (metrics.py deprecated). 小吴 owns ocr-lite evaluation starting week of 2026-10-19 — route eval questions to him.","Workbench machines: node-07 unavailable Tuesday evenings (disk swap, noted 2026-10-16); node-02 driver upgraded to 575. Don't schedule tasks on node-07 Tue evenings.","seg-probe (老周/lz-) is a DIFFERENT project from user's seg-prune, same server. His jobs start with \"lz-\". Strict rule: any seg-probe job exceeding budget by even 1 minute must STOP and ask 老周 first — no exceptions, no auto-start. He runs jobs in the afternoon; do not schedule lz- jobs at night."]}},{"session":"n4-colleague","args":{"operations":[{"action":"patch","content":"ocr-lite: nightly budget is typically 5h (set by 小吴). metrics script is metrics_v3.py (metrics.py deprecated). 小吴 owns ocr-lite evaluation starting week of 2026-10-19 — route eval questions to him.","old_text":"(metrics.py deprecated). 小吴 owns ocr-lite evaluation starting week of 2026-10-19 — route eval questions to him. (metrics.py deprecated). 小吴 owns ocr-lite evaluation starting week of 2026-10-19 — route eval questions to him."}],"target":"memory"},"result":{"success":true,"usage":"1367/2200","notes":[]}},{"session":"n4-colleague","args":{"operations":[{"action":"patch","content":"When user is asleep, if smoke test exceeds budget by ≤20 min, start the training run directly without waiting for confirmation. Exceptions requiring explicit approval first: arm-control, and 老周's seg-probe (lz-) jobs — any over-budget, even 1 minute, must stop and ask 老周.","old_text":"Exception: arm-control — always requires explicit approval."}],"target":"user"},"result":{"success":true,"usage":"548/1375","notes":[]}},{"session":"n5-week","args":{"action":"add","content":"seg-prune: baseline mIoU prune-20 = 41.3, prune-30 = 40.8. Defaults: lr 1e-3, warmup 300 steps, seed 7. Job naming convention: \"改动-数值\" (e.g. prune-30).","target":"memory"},"result":{"success":true,"usage":"1367/2200","notes":[]}},{"session":"n5-week","args":{"action":"patch","content":"arm-control: policy net ppo-v3, control freq 50Hz, 85 demo episodes; models in /models/arm (keep separate from seg-prune outputs). Demo for partners at end of month (Oct 2026).","old_text":"arm-control: policy net ppo-v3, control freq 50Hz, 85 demo episodes; models stored in /models/arm (keep separate from seg-prune outputs).","target":"memory"},"result":{"success":true,"usage":"1367/2200","notes":[]}},{"session":"n5-week","args":{"action":"patch","content":"seg-probe (老周/lz-) is a DIFFERENT project from user's seg-prune, same server. His jobs start with \"lz-\". Strict rule: any seg-probe job exceeding budget by even 1 minute must STOP and ask 老周 first — no exceptions, no auto-start. He runs jobs in the afternoon; do not schedule lz- jobs at night. Batch size now 64 (as of 2026-10-20).","old_text":"seg-probe (老周/lz-) is a DIFFERENT project from user's seg-prune, same server. His jobs start with \"lz-\". Strict rule: any seg-probe job exceeding budget by even 1 minute must STOP and ask 老周 first — no exceptions, no auto-start. He runs jobs in the afternoon; do not schedule lz- jobs at night.","target":"memory"},"result":{"success":true,"usage":"1367/2200","notes":[]}},{"session":"n5-week","args":{"action":"patch","content":"ocr-lite: nightly budget is typically 5h (set by 小吴). metrics script is metrics_v3.py (metrics.py deprecated). 小吴 owns ocr-lite evaluation starting week of 2026-10-19 — route eval questions to him. Exception: ocr-large may overrun the budget by up to ~35 min without checking — 小吴 approved (noted 2026-10-20).","old_text":"ocr-lite: nightly budget is typically 5h (set by 小吴). metrics script is metrics_v3.py","target":"memory"},"result":{"success":true,"usage":"1367/2200","notes":[]}},{"session":"n6-cap","args":{"operations":[{"action":"patch","old_text":"node-07 unavailable Tuesday evenings (disk swap, noted 2026-10-16)","content":"node-07 disk swap done — restored/available as of 2026-10-22"}],"target":"memory"},"result":{"success":true,"usage":"1361/2200","notes":[]}},{"session":"n6-cap","args":{"operations":[{"action":"add","content":"One-off exception 2026-10-22: user required hard 6h cap for that night's overnight run (demo next morning) — stop and ask if smoke test >6h, no auto-start. Applies only to that night."}],"target":"user"},"result":{"success":true,"usage":"734/1375","notes":[]}}]},"mem0":{"kind":"records","memories":[{"id":"0b3ecf7c-e49b-4394-ac96-c4bb8529ea6a","memory":"User's standing preference: when asleep, if a smoke test exceeds the budget by less than 20 minutes, assistant should start training directly without waiting for confirmation.","metadata":{"session":"n1-overnight"},"created_at":"2026-11-08T14:52:01.288122+00:00"},{"id":"221f89ea-0dda-4c38-803a-3ceb8cd0da02","memory":"The standard nightly budget for ocr-lite tasks is 5 hours, a setting established by Xiao Wu.","metadata":{"session":"n4-colleague"},"created_at":"2026-11-08T14:52:22.131826+00:00"},{"id":"37fa1dc3-c33f-4511-a62b-ca1369924c05","memory":"The ocr-lite nightly task 'ocr-base' completed in 5 hours with output located at /out/ocr-lite/base.","metadata":{"session":"n1-overnight"},"created_at":"2026-11-08T14:52:01.299809+00:00"},{"id":"44829737-761f-4b57-bae5-57b066a2242b","memory":"Xiao Wu will take over responsibility for ocr-lite evaluation starting next week (around mid-November 2026); users should contact him for any issues regarding this task.","metadata":{"session":"n3-misc"},"created_at":"2026-11-08T14:52:16.597452+00:00"},{"id":"518e1306-5f94-43bb-9db3-2497144ff1b9","memory":"The 'arm-control' project uses a shared machine equipped with a robotic experimental platform and has only 16GB of VRAM.","metadata":{"session":"n2-arm"},"created_at":"2026-11-08T14:52:06.207610+00:00"},{"id":"5255d8ab-5f6d-4855-97d0-bf857d46ac2c","memory":"Lao Zhou's jobs are identified by the prefix 'lz-' and he typically runs tasks in the afternoon, avoiding evening scheduling.","metadata":{"session":"n4-colleague"},"created_at":"2026-11-08T14:52:22.128857+00:00"},{"id":"6428daa5-eb18-4750-a2e6-b13ed4980f8e","memory":"Default training configuration for the seg-prune project is learning rate 1e-3, warmup steps 300, and fixed random seed 7.","metadata":{"session":"n5-week"},"created_at":"2026-11-08T14:52:29.483342+00:00"},{"id":"65f57cd9-a7f2-42c9-87b6-d072aa05efaf","memory":"The 'arm-control' project has a deadline to demonstrate results to partners by the end of November 2026.","metadata":{"session":"n5-week"},"created_at":"2026-11-08T14:52:29.487571+00:00"},{"id":"69113e64-e921-419c-975c-897f947c4396","memory":"User established a naming convention for seg-prune jobs as 'change-value' (e.g., prune-30).","metadata":{"session":"n5-week"},"created_at":"2026-11-08T14:52:29.495200+00:00"},{"id":"73d38107-5f86-4ad8-990f-048bc84efa2a","memory":"Metric scripts have been standardized to metrics_v3.py; the previous script metrics.py is deprecated and should no longer be used.","metadata":{"session":"n3-misc"},"created_at":"2026-11-08T14:52:16.600769+00:00"},{"id":"7ba4d01e-7a58-47ff-9845-fbe98cbcbe60","memory":"The hard drive replacement for node-07 was completed by the evening of October 22, 2026, restoring the node to operational status.","metadata":{"session":"n6-cap"},"created_at":"2026-11-08T14:52:38.039268+00:00"},{"id":"7d3fdee3-e887-43af-9422-abe32798b003","memory":"User updated the seg-prune project to use dataset /data/ade-mini-v3 and baseline model deeplab-v4, explicitly instructing to stop using the old directory and confirming that deeplab-v3 weights have been cleaned up.","metadata":{"session":"n3-misc"},"created_at":"2026-11-08T14:52:16.581542+00:00"},{"id":"8583d13f-b0f9-422b-81fa-e3c574803b88","memory":"The driver for node-02 has been upgraded to version 575.","metadata":{"session":"n3-misc"},"created_at":"2026-11-08T14:52:16.593886+00:00"},{"id":"8c09a49b-8e20-435f-bd8a-138e04fd030d","memory":"Models for the 'arm-control' project are stored in /models/arm to keep them separate from seg-prune models.","metadata":{"session":"n2-arm"},"created_at":"2026-11-08T14:52:06.215488+00:00"},{"id":"8ceeaecb-69df-42d7-8908-b60179421df8","memory":"Lao Zhou uses the same server as User for his project 'seg-probe', which is distinct from User's 'seg-prune' project.","metadata":{"session":"n4-colleague"},"created_at":"2026-11-08T14:52:22.122042+00:00"},{"id":"96f42110-784e-4acb-8650-c3a65e84e23d","memory":"The seg-prune project job 'prune-30' (30% pruning rate) was estimated to take 6 hours 18 minutes against a 6-hour budget; user instructed it to run immediately on Nov 8, 2026.","metadata":{"session":"n1-overnight"},"created_at":"2026-11-08T14:52:01.294580+00:00"},{"id":"a4050d67-5f81-4e57-bdbf-4ca501a89374","memory":"User's standing preference: all training jobs for the 'arm-control' project must receive explicit user approval before starting, regardless of duration or resource usage.","metadata":{"session":"n2-arm"},"created_at":"2026-11-08T14:52:06.205063+00:00"},{"id":"a639d48f-2a2a-4e87-b3e5-ca631230603d","memory":"User recorded seg-prune baseline metrics: prune-20 achieved mIoU of 41.3 and prune-30 achieved mIoU of 40.8.","metadata":{"session":"n5-week"},"created_at":"2026-11-08T14:52:29.479755+00:00"},{"id":"aec281ce-f2a5-489a-8822-c6c084bfd2dd","memory":"The ocr-lite task 'ocr-large' previously exceeded its budget by 35 minutes, which Xiao Wu stated was acceptable.","metadata":{"session":"n5-week"},"created_at":"2026-11-08T14:52:29.491325+00:00"},{"id":"aff63a6a-99ef-4c16-a5a2-dcf1a50c874d","memory":"Lao Zhou's 'seg-probe' project currently uses a batch size of 64.","metadata":{"session":"n5-week"},"created_at":"2026-11-08T14:52:29.493142+00:00"},{"id":"bd0c3d52-aaf3-47c6-8eec-ff6607641fde","memory":"Lao Zhou requires that any of his tasks exceeding the budget by even one minute must be stopped and approved by him before proceeding.","metadata":{"session":"n4-colleague"},"created_at":"2026-11-08T14:52:22.124688+00:00"},{"id":"d173d343-2e17-4fdb-abad-5b20fdfa3f6e","memory":"User prefers not to be disturbed with messages in the morning; all updates should be consolidated into a single report at 12:00 PM.","metadata":{"session":"n3-misc"},"created_at":"2026-11-08T14:52:16.587230+00:00"},{"id":"d17d0b28-887b-4e8b-a403-48f83fd2f9e7","memory":"The current policy network for 'arm-control' is ppo-v3, operating at a control frequency of 50Hz with 85 demonstration data samples.","metadata":{"session":"n2-arm"},"created_at":"2026-11-08T14:52:06.211876+00:00"},{"id":"e5d214a8-299a-402d-a947-9f10021bc77a","memory":"User instructed that on the night of October 22, 2026, only for that specific instance, the server budget was strictly capped at 6 hours. If a smoke test exceeded this limit, the assistant must stop and ask for permission rather than proceeding directly.","metadata":{"session":"n6-cap"},"created_at":"2026-11-08T14:52:38.037089+00:00"},{"id":"fa6a4421-e574-4e1f-adc4-9d6dccf5971e","memory":"Node-07 requires a hard drive replacement on Tuesday evening (around November 10, 2026), so no tasks should be scheduled on it during that time.","metadata":{"session":"n3-misc"},"created_at":"2026-11-08T14:52:16.591943+00:00"}],"add_log":[{"session":"n1-overnight","result":[{"id":"0b3ecf7c-e49b-4394-ac96-c4bb8529ea6a","memory":"User's standing preference: when asleep, if a smoke test exceeds the budget by less than 20 minutes, assistant should start training directly without waiting for confirmation.","event":"ADD"},{"id":"96f42110-784e-4acb-8650-c3a65e84e23d","memory":"The seg-prune project job 'prune-30' (30% pruning rate) was estimated to take 6 hours 18 minutes against a 6-hour budget; user instructed it to run immediately on Nov 8, 2026.","event":"ADD"},{"id":"37fa1dc3-c33f-4511-a62b-ca1369924c05","memory":"The ocr-lite nightly task 'ocr-base' completed in 5 hours with output located at /out/ocr-lite/base.","event":"ADD"}]},{"session":"n2-arm","result":[{"id":"a4050d67-5f81-4e57-bdbf-4ca501a89374","memory":"User's standing preference: all training jobs for the 'arm-control' project must receive explicit user approval before starting, regardless of duration or resource usage.","event":"ADD"},{"id":"518e1306-5f94-43bb-9db3-2497144ff1b9","memory":"The 'arm-control' project uses a shared machine equipped with a robotic experimental platform and has only 16GB of VRAM.","event":"ADD"},{"id":"d17d0b28-887b-4e8b-a403-48f83fd2f9e7","memory":"The current policy network for 'arm-control' is ppo-v3, operating at a control frequency of 50Hz with 85 demonstration data samples.","event":"ADD"},{"id":"8c09a49b-8e20-435f-bd8a-138e04fd030d","memory":"Models for the 'arm-control' project are stored in /models/arm to keep them separate from seg-prune models.","event":"ADD"}]},{"session":"n3-misc","result":[{"id":"7d3fdee3-e887-43af-9422-abe32798b003","memory":"User updated the seg-prune project to use dataset /data/ade-mini-v3 and baseline model deeplab-v4, explicitly instructing to stop using the old directory and confirming that deeplab-v3 weights have been cleaned up.","event":"ADD"},{"id":"d173d343-2e17-4fdb-abad-5b20fdfa3f6e","memory":"User prefers not to be disturbed with messages in the morning; all updates should be consolidated into a single report at 12:00 PM.","event":"ADD"},{"id":"fa6a4421-e574-4e1f-adc4-9d6dccf5971e","memory":"Node-07 requires a hard drive replacement on Tuesday evening (around November 10, 2026), so no tasks should be scheduled on it during that time.","event":"ADD"},{"id":"8583d13f-b0f9-422b-81fa-e3c574803b88","memory":"The driver for node-02 has been upgraded to version 575.","event":"ADD"},{"id":"44829737-761f-4b57-bae5-57b066a2242b","memory":"Xiao Wu will take over responsibility for ocr-lite evaluation starting next week (around mid-November 2026); users should contact him for any issues regarding this task.","event":"ADD"},{"id":"73d38107-5f86-4ad8-990f-048bc84efa2a","memory":"Metric scripts have been standardized to metrics_v3.py; the previous script metrics.py is deprecated and should no longer be used.","event":"ADD"}]},{"session":"n4-colleague","result":[{"id":"8ceeaecb-69df-42d7-8908-b60179421df8","memory":"Lao Zhou uses the same server as User for his project 'seg-probe', which is distinct from User's 'seg-prune' project.","event":"ADD"},{"id":"bd0c3d52-aaf3-47c6-8eec-ff6607641fde","memory":"Lao Zhou requires that any of his tasks exceeding the budget by even one minute must be stopped and approved by him before proceeding.","event":"ADD"},{"id":"5255d8ab-5f6d-4855-97d0-bf857d46ac2c","memory":"Lao Zhou's jobs are identified by the prefix 'lz-' and he typically runs tasks in the afternoon, avoiding evening scheduling.","event":"ADD"},{"id":"221f89ea-0dda-4c38-803a-3ceb8cd0da02","memory":"The standard nightly budget for ocr-lite tasks is 5 hours, a setting established by Xiao Wu.","event":"ADD"}]},{"session":"n5-week","result":[{"id":"a639d48f-2a2a-4e87-b3e5-ca631230603d","memory":"User recorded seg-prune baseline metrics: prune-20 achieved mIoU of 41.3 and prune-30 achieved mIoU of 40.8.","event":"ADD"},{"id":"6428daa5-eb18-4750-a2e6-b13ed4980f8e","memory":"Default training configuration for the seg-prune project is learning rate 1e-3, warmup steps 300, and fixed random seed 7.","event":"ADD"},{"id":"65f57cd9-a7f2-42c9-87b6-d072aa05efaf","memory":"The 'arm-control' project has a deadline to demonstrate results to partners by the end of November 2026.","event":"ADD"},{"id":"aec281ce-f2a5-489a-8822-c6c084bfd2dd","memory":"The ocr-lite task 'ocr-large' previously exceeded its budget by 35 minutes, which Xiao Wu stated was acceptable.","event":"ADD"},{"id":"aff63a6a-99ef-4c16-a5a2-dcf1a50c874d","memory":"Lao Zhou's 'seg-probe' project currently uses a batch size of 64.","event":"ADD"},{"id":"69113e64-e921-419c-975c-897f947c4396","memory":"User established a naming convention for seg-prune jobs as 'change-value' (e.g., prune-30).","event":"ADD"}]},{"session":"n6-cap","result":[{"id":"e5d214a8-299a-402d-a947-9f10021bc77a","memory":"User instructed that on the night of October 22, 2026, only for that specific instance, the server budget was strictly capped at 6 hours. If a smoke test exceeded this limit, the assistant must stop and ask for permission rather than proceeding directly.","event":"ADD"},{"id":"7ba4d01e-7a58-47ff-9845-fbe98cbcbe60","memory":"The hard drive replacement for node-07 was completed by the evening of October 22, 2026, restoring the node to operational status.","event":"ADD"}]}]},"graphiti":{"kind":"graph","nodes":[{"uuid":"ff831614-d85d-48e1-b4f6-6e6b35d72b81","name":"arm-control","summary":"arm-control 项目使用的是机器人实验台那台共享机器，该机器只有 16G 显存。\narm-control 的策略网络当前版本为 ppo-v3，控制频率 50Hz，演示数据 85 条。\narm-control 的模型统一存储到 /models/arm 目录，不与 seg 项目的模型混放。\narm-control needs to be shown to partners by the end of the month.","labels":["Entity"]},{"uuid":"fef23b0d-3f69-4e69-ba73-d62c9c248688","name":"metrics.py","summary":"旧的 metrics.py 脚本不再使用（针对 ocr-lite 评测）。","labels":["Entity"]},{"uuid":"fc172ea3-c3d6-4f82-bb0a-c974b576c58e","name":"小吴","summary":"小吴从下周开始负责 ocr-lite 的评测工作。\n小吴定了 ocr-lite 夜间预算通常为 5 小时。\n小吴 stated that ocr-large running 35 minutes over budget was acceptable.","labels":["Entity"]},{"uuid":"f22c6b3f-dcbf-404c-b88a-ecc7380c1ffc","name":"deeplab-v4","summary":"seg-prune 项目的基线模型是 deeplab-v4。","labels":["Entity"]},{"uuid":"ea6f8f75-7b0c-4aec-9ef3-72b5522063a4","name":"node-02","summary":"node-02 的驱动升级到 575 版本。\nnode-02 的驱动升级到 575 版本。","labels":["Entity"]},{"uuid":"e71f9b9c-a45f-46d5-a882-b5d78ea6a59a","name":"user","summary":"The user granted the assistant autonomy to directly start training jobs when asleep if the smoke test exceeds the budget by 20 minutes or less, without waiting for confirmation.\nThe user reported that ocr-base ran for 5 hours and finished last night.\n用户指示助手上午不要发消息打扰，有事统一在中午十二点汇报。\nnode-07 计划在周二晚上更换硬盘，那天不排任务。\nThe user instructed the assistant to stop and ask for authorization if the smoke test exceeds 6 hours tonight (October 22), rather than running it directly.\nThe user stated that ocr-lite would not run tonight.\nThe user confirmed that the hard drive on node-07 has been replaced.","labels":["Entity"]},{"uuid":"d8b2cbde-2b9a-4659-bcc5-b444628d4c1c","name":"prune-20","summary":"The mIoU score for prune-20 is 41.3.","labels":["Entity"]},{"uuid":"d882bc3c-d68b-458f-973b-a385fc58418c","name":"metrics_v3.py","summary":"指标脚本统一换成 metrics_v3.py，用于 ocr-lite 等项目的评测。","labels":["Entity"]},{"uuid":"d2f3db62-309c-488b-b844-8f65306e6c9d","name":"lz-","summary":"老周的 job 都以 lz- 开头。","labels":["Entity"]},{"uuid":"cb843c0c-d06f-4879-9f04-2a4fe0e45b95","name":"/data/ade-mini-v3","summary":"seg-prune 的数据已换成 /data/ade-mini-v3，旧目录不再使用。","labels":["Entity"]},{"uuid":"cb5ccf6d-55cf-4dc9-8c23-c6d061655753","name":"机器人实验台那台共享机器","summary":"arm-control 项目使用的是机器人实验台那台共享机器，该机器只有 16G 显存。","labels":["Entity"]},{"uuid":"b0d3aae5-ca58-477f-9d43-91a8ebaabd50","name":"40.8","summary":"The mIoU score for the prune-30 model in the seg-prune project.","labels":["Entity"]},{"uuid":"aa7b16e3-2ac5-4a5b-9629-c2fbc87d926b","name":"seg-probe","summary":"老周的项目叫 seg-probe。\nseg-probe 和 user 的 seg-prune 是两回事，需要分开处理。\nseg-probe's batch size was increased to 64 under 老周's project.","labels":["Entity"]},{"uuid":"955c42cf-0aaa-4a46-addf-c0a99f0f439d","name":"assistant","summary":"The assistant estimated that prune-30 would require 6 hours and 18 minutes, which is slightly over the 6-hour budget.\nThe user granted the assistant autonomy to directly start training jobs when asleep if the smoke test exceeds the budget by 20 minutes or less, without waiting for confirmation.\nThe assistant started the prune-30 job upon the user's instruction.\n用户指示助手上午不要发消息打扰，有事统一在中午十二点汇报。\nThe user instructed the assistant to stop and ask for authorization if the smoke test exceeds 6 hours tonight (October 22), rather than running it directly.","labels":["Entity"]},{"uuid":"902a3d65-9307-43b7-9531-f33295ec1fdd","name":"seg-prune","summary":"prune-30 is a job within the seg-prune project, testing a pruning rate of 30%.\nseg-prune 的数据已换成 /data/ade-mini-v3，旧目录不再使用。\nseg-prune 项目的基线模型是 deeplab-v4。\ndeeplab-v3 的权重已从 seg-prune 项目中清理掉。\nseg-probe 和 user 的 seg-prune 是两回事，需要分开处理。\narm-control needs to be shown to partners by the end of the month.","labels":["Entity"]},{"uuid":"6e339b16-9e26-45e2-9930-cb14a8797b90","name":"mIoU","summary":"The mIoU score for prune-20 is 41.3.\nThe mIoU score for prune-30 is 40.8.","labels":["Entity"]},{"uuid":"60314fca-de45-4029-a207-38f15b2e5a7b","name":"ocr-large","summary":"小吴 stated that ocr-large running 35 minutes over budget was acceptable.","labels":["Entity"]},{"uuid":"5a8daf0f-0ddb-4187-8016-9cd3fbc5df35","name":"ocr-base","summary":"ocr-base was a nightly task associated with ocr-lite.\nThe user reported that ocr-base ran for 5 hours and finished last night.","labels":["Entity"]},{"uuid":"510092ec-1c1e-404b-bf84-012a5a209d48","name":"node-07","summary":"node-07 计划在周二晚上更换硬盘，那天不排任务。\nThe user confirmed that the hard drive on node-07 has been replaced.","labels":["Entity"]},{"uuid":"4e84b9a9-8aae-4681-98a1-5073c0205600","name":"ocr-lite","summary":"ocr-base was a nightly task associated with ocr-lite.\n小吴从下周开始负责 ocr-lite 的评测工作。\n指标脚本统一换成 metrics_v3.py，用于 ocr-lite 等项目的评测。\n旧的 metrics.py 脚本不再使用（针对 ocr-lite 评测）。\n小吴定了 ocr-lite 夜间预算通常为 5 小时。\nThe user stated that ocr-lite would not run tonight.","labels":["Entity"]},{"uuid":"3a217a75-53a4-421d-909b-832bff38a321","name":"老周","summary":"老周的项目叫 seg-probe。\n老周的 job 都以 lz- 开头。\nseg-probe's batch size was increased to 64 under 老周's project.","labels":["Entity"]},{"uuid":"38ef6cee-8632-4b6d-af88-b93cfbe7c4ae","name":"prune-30","summary":"prune-30 is a job within the seg-prune project, testing a pruning rate of 30%.\nThe assistant estimated that prune-30 would require 6 hours and 18 minutes, which is slightly over the 6-hour budget.\nThe assistant started the prune-30 job upon the user's instruction.\nThe mIoU score for prune-30 is 40.8.","labels":["Entity"]},{"uuid":"3499b317-69ec-4791-a04d-080671acd1d5","name":"41.3","summary":"The mIoU score for the prune-20 model in the seg-prune project.","labels":["Entity"]},{"uuid":"33d086f1-22d6-4468-8c9a-a3875f1e8059","name":"/models/arm","summary":"arm-control 的模型统一存储到 /models/arm 目录，不与 seg 项目的模型混放。","labels":["Entity"]},{"uuid":"1d9b7821-ea11-4f22-a0b1-8fe13ed05413","name":"deeplab-v3","summary":"deeplab-v3 的权重已从 seg-prune 项目中清理掉。","labels":["Entity"]},{"uuid":"0a79187e-5003-4353-9bcc-fc26e8856249","name":"ppo-v3","summary":"arm-control 的策略网络当前版本为 ppo-v3，控制频率 50Hz，演示数据 85 条。","labels":["Entity"]}],"edges":[{"uuid":"f7ea0b5b-98ba-47d2-9320-0ee19a21c669","source":"60314fca-de45-4029-a207-38f15b2e5a7b","target":"fc172ea3-c3d6-4f82-bb0a-c974b576c58e","name":"APPROVED_BY","fact":"小吴 stated that ocr-large running 35 minutes over budget was acceptable.","valid_at":"2026-10-20T10:10:00+00:00","invalid_at":null,"expired_at":null,"episodes":["36b02dc2-734c-4773-be1a-21da69849b59"]},{"uuid":"e902c124-a8a7-43a4-9ab7-1206a2ae599e","source":"902a3d65-9307-43b7-9531-f33295ec1fdd","target":"ff831614-d85d-48e1-b4f6-6e6b35d72b81","name":"HAS_DEADLINE","fact":"arm-control needs to be shown to partners by the end of the month.","valid_at":"2026-10-20T10:10:00+00:00","invalid_at":null,"expired_at":null,"episodes":["36b02dc2-734c-4773-be1a-21da69849b59"]},{"uuid":"d8ea1718-fcee-4ea2-b02f-91efb54b368c","source":"e71f9b9c-a45f-46d5-a882-b5d78ea6a59a","target":"955c42cf-0aaa-4a46-addf-c0a99f0f439d","name":"INSTRUCTS_TO_PAUSE_ON_EXCESS","fact":"The user instructed the assistant to stop and ask for authorization if the smoke test exceeds 6 hours tonight (October 22), rather than running it directly.","valid_at":"2026-10-22T22:00:00+00:00","invalid_at":null,"expired_at":null,"episodes":["e3127349-1781-4f01-84a7-f99d2b9bf565"]},{"uuid":"d77d40e9-84dc-42ce-81da-4add65dea800","source":"5a8daf0f-0ddb-4187-8016-9cd3fbc5df35","target":"e71f9b9c-a45f-46d5-a882-b5d78ea6a59a","name":"REPORTED_TO","fact":"The user reported that ocr-base ran for 5 hours and finished last night.","valid_at":"2026-10-13T23:10:00+00:00","invalid_at":null,"expired_at":null,"episodes":["c4ce97bf-8318-4fdf-9d35-6b6c6cf23761"]},{"uuid":"c8215f79-9896-499e-93af-e0b7c0dacd09","source":"d8b2cbde-2b9a-4659-bcc5-b444628d4c1c","target":"6e339b16-9e26-45e2-9930-cb14a8797b90","name":"HAS_SCORE","fact":"The mIoU score for prune-20 is 41.3.","valid_at":"2026-10-20T10:10:00+00:00","invalid_at":null,"expired_at":null,"episodes":["36b02dc2-734c-4773-be1a-21da69849b59"]},{"uuid":"ae4fc91a-0c55-4b0c-883d-1d4569bb09f6","source":"ff831614-d85d-48e1-b4f6-6e6b35d72b81","target":"0a79187e-5003-4353-9bcc-fc26e8856249","name":"USES_MODEL","fact":"arm-control 的策略网络当前版本为 ppo-v3，控制频率 50Hz，演示数据 85 条。","valid_at":"2026-10-15T09:40:00+00:00","invalid_at":null,"expired_at":null,"episodes":["a44b8c14-1cf7-4784-b37d-d145905dab07"]},{"uuid":"a4d59456-0b53-40c7-a02f-ba7b62fb3ec8","source":"d2f3db62-309c-488b-b844-8f65306e6c9d","target":"3a217a75-53a4-421d-909b-832bff38a321","name":"PREFIX_FOR","fact":"老周的 job 都以 lz- 开头。","valid_at":"2026-10-18T15:50:00+00:00","invalid_at":null,"expired_at":null,"episodes":["136188b2-54ce-49e2-9852-534c497906b0"]},{"uuid":"9e553f0d-285c-473c-a212-8e9199c27777","source":"955c42cf-0aaa-4a46-addf-c0a99f0f439d","target":"38ef6cee-8632-4b6d-af88-b93cfbe7c4ae","name":"ESTIMATED_DURATION_FOR","fact":"The assistant estimated that prune-30 would require 6 hours and 18 minutes, which is slightly over the 6-hour budget.","valid_at":"2026-10-13T23:10:00+00:00","invalid_at":null,"expired_at":null,"episodes":["c4ce97bf-8318-4fdf-9d35-6b6c6cf23761"]},{"uuid":"961cacaa-683b-4b09-beee-c778c2155c5a","source":"d882bc3c-d68b-458f-973b-a385fc58418c","target":"4e84b9a9-8aae-4681-98a1-5073c0205600","name":"IS_UNIFIED_METRICS_SCRIPT_FOR","fact":"指标脚本统一换成 metrics_v3.py，用于 ocr-lite 等项目的评测。","valid_at":"2026-10-16T13:30:00+00:00","invalid_at":null,"expired_at":null,"episodes":["b217d859-bfaf-4301-8634-254eaeb5f1a4"]},{"uuid":"8a4da0e4-3d42-40e1-be2c-b2ec31072671","source":"510092ec-1c1e-404b-bf84-012a5a209d48","target":"e71f9b9c-a45f-46d5-a882-b5d78ea6a59a","name":"HARDWARE_REPLACED_BY","fact":"The user confirmed that the hard drive on node-07 has been replaced.","valid_at":"2026-10-22T22:00:00+00:00","invalid_at":null,"expired_at":null,"episodes":["e3127349-1781-4f01-84a7-f99d2b9bf565"]},{"uuid":"75bd6fb9-466a-4ea7-b084-b09cca241f90","source":"902a3d65-9307-43b7-9531-f33295ec1fdd","target":"f22c6b3f-dcbf-404c-b88a-ecc7380c1ffc","name":"HAS_BASELINE_MODEL","fact":"seg-prune 项目的基线模型是 deeplab-v4。","valid_at":"2026-10-16T13:30:00+00:00","invalid_at":null,"expired_at":null,"episodes":["b217d859-bfaf-4301-8634-254eaeb5f1a4"]},{"uuid":"67adb3d3-246e-4d33-897c-abe4fc3f99c1","source":"3a217a75-53a4-421d-909b-832bff38a321","target":"aa7b16e3-2ac5-4a5b-9629-c2fbc87d926b","name":"WORKS_ON","fact":"老周的项目叫 seg-probe。","valid_at":"2026-10-18T15:50:00+00:00","invalid_at":null,"expired_at":null,"episodes":["136188b2-54ce-49e2-9852-534c497906b0"]},{"uuid":"66176ac4-6bf2-406b-9f58-0c959170a441","source":"ea6f8f75-7b0c-4aec-9ef3-72b5522063a4","target":"ea6f8f75-7b0c-4aec-9ef3-72b5522063a4","name":"DRIVER_UPGRADED_TO","fact":"node-02 的驱动升级到 575 版本。","valid_at":"2026-10-16T13:30:00+00:00","invalid_at":null,"expired_at":null,"episodes":["b217d859-bfaf-4301-8634-254eaeb5f1a4"]},{"uuid":"63764a74-bd92-4f12-9b80-d5969f3b9118","source":"902a3d65-9307-43b7-9531-f33295ec1fdd","target":"cb843c0c-d06f-4879-9f04-2a4fe0e45b95","name":"USES_DATA","fact":"seg-prune 的数据已换成 /data/ade-mini-v3，旧目录不再使用。","valid_at":"2026-10-16T13:30:00+00:00","invalid_at":null,"expired_at":null,"episodes":["b217d859-bfaf-4301-8634-254eaeb5f1a4"]},{"uuid":"5bea0aa1-bbdf-4d0f-a7d4-120e6a9625fc","source":"e71f9b9c-a45f-46d5-a882-b5d78ea6a59a","target":"4e84b9a9-8aae-4681-98a1-5073c0205600","name":"EXCLUDES_FROM_RUN_TONIGHT","fact":"The user stated that ocr-lite would not run tonight.","valid_at":"2026-10-22T22:00:00+00:00","invalid_at":null,"expired_at":null,"episodes":["e3127349-1781-4f01-84a7-f99d2b9bf565"]},{"uuid":"53b4e777-4259-420b-ab35-a6378255f7a5","source":"5a8daf0f-0ddb-4187-8016-9cd3fbc5df35","target":"4e84b9a9-8aae-4681-98a1-5073c0205600","name":"IS_TASK_OF","fact":"ocr-base was a nightly task associated with ocr-lite.","valid_at":"2026-10-13T00:00:00+00:00","invalid_at":"2026-10-16T13:30:00+00:00","expired_at":"2026-11-08T14:52:50.206137+00:00","episodes":["c4ce97bf-8318-4fdf-9d35-6b6c6cf23761"]},{"uuid":"525a8662-f435-46ae-a6c2-5e052e385e10","source":"fc172ea3-c3d6-4f82-bb0a-c974b576c58e","target":"4e84b9a9-8aae-4681-98a1-5073c0205600","name":"SET_BUDGET_FOR","fact":"小吴定了 ocr-lite 夜间预算通常为 5 小时。","valid_at":"2026-10-18T15:50:00+00:00","invalid_at":null,"expired_at":null,"episodes":["136188b2-54ce-49e2-9852-534c497906b0"]},{"uuid":"509d843a-fb44-41f0-8d79-847ad0284b03","source":"e71f9b9c-a45f-46d5-a882-b5d78ea6a59a","target":"955c42cf-0aaa-4a46-addf-c0a99f0f439d","name":"GRANTED_AUTONOMY_TO","fact":"The user granted the assistant autonomy to directly start training jobs when asleep if the smoke test exceeds the budget by 20 minutes or less, without waiting for confirmation.","valid_at":"2026-10-13T23:10:00+00:00","invalid_at":"2026-10-22T22:00:00+00:00","expired_at":"2026-11-08T14:53:31.360600+00:00","episodes":["c4ce97bf-8318-4fdf-9d35-6b6c6cf23761"]},{"uuid":"509253b4-8c77-43dc-b855-08e389ebc904","source":"955c42cf-0aaa-4a46-addf-c0a99f0f439d","target":"38ef6cee-8632-4b6d-af88-b93cfbe7c4ae","name":"STARTED_JOB","fact":"The assistant started the prune-30 job upon the user's instruction.","valid_at":"2026-10-13T23:10:00+00:00","invalid_at":null,"expired_at":null,"episodes":["c4ce97bf-8318-4fdf-9d35-6b6c6cf23761"]},{"uuid":"49dfef8f-b369-41cf-8344-959109f4d7e1","source":"1d9b7821-ea11-4f22-a0b1-8fe13ed05413","target":"902a3d65-9307-43b7-9531-f33295ec1fdd","name":"WEIGHTS_CLEANED_FROM","fact":"deeplab-v3 的权重已从 seg-prune 项目中清理掉。","valid_at":"2026-10-16T13:30:00+00:00","invalid_at":null,"expired_at":null,"episodes":["b217d859-bfaf-4301-8634-254eaeb5f1a4"]},{"uuid":"489e8c36-ca88-4ec5-b68a-d47b92fc24a6","source":"fef23b0d-3f69-4e69-ba73-d62c9c248688","target":"4e84b9a9-8aae-4681-98a1-5073c0205600","name":"DEPRECATED_FOR","fact":"旧的 metrics.py 脚本不再使用（针对 ocr-lite 评测）。","valid_at":"2026-10-16T13:30:00+00:00","invalid_at":null,"expired_at":null,"episodes":["b217d859-bfaf-4301-8634-254eaeb5f1a4"]},{"uuid":"47add49c-90f3-4437-96a1-10ce3e14b222","source":"fc172ea3-c3d6-4f82-bb0a-c974b576c58e","target":"4e84b9a9-8aae-4681-98a1-5073c0205600","name":"WILL_MANAGE_EVALUATION_OF","fact":"小吴从下周开始负责 ocr-lite 的评测工作。","valid_at":"2026-10-16T13:30:00+00:00","invalid_at":null,"expired_at":null,"episodes":["b217d859-bfaf-4301-8634-254eaeb5f1a4"]},{"uuid":"44f67259-88e9-4f1d-9165-f286092491b1","source":"38ef6cee-8632-4b6d-af88-b93cfbe7c4ae","target":"902a3d65-9307-43b7-9531-f33295ec1fdd","name":"PART_OF_PROJECT","fact":"prune-30 is a job within the seg-prune project, testing a pruning rate of 30%.","valid_at":"2026-10-13T23:10:00+00:00","invalid_at":null,"expired_at":null,"episodes":["c4ce97bf-8318-4fdf-9d35-6b6c6cf23761"]},{"uuid":"40f4746e-cda8-4bd0-8e82-012e48251de5","source":"510092ec-1c1e-404b-bf84-012a5a209d48","target":"e71f9b9c-a45f-46d5-a882-b5d78ea6a59a","name":"MAINTENANCE_SCHEDULED_FOR_BY","fact":"node-07 计划在周二晚上更换硬盘，那天不排任务。","valid_at":"2026-10-16T13:30:00+00:00","invalid_at":null,"expired_at":null,"episodes":["b217d859-bfaf-4301-8634-254eaeb5f1a4"]},{"uuid":"3cb34b83-ea61-4c0a-9ab4-0acb7cb32e0e","source":"38ef6cee-8632-4b6d-af88-b93cfbe7c4ae","target":"6e339b16-9e26-45e2-9930-cb14a8797b90","name":"HAS_SCORE","fact":"The mIoU score for prune-30 is 40.8.","valid_at":"2026-10-20T10:10:00+00:00","invalid_at":null,"expired_at":null,"episodes":["36b02dc2-734c-4773-be1a-21da69849b59"]},{"uuid":"3ae3e331-ce62-498c-bea2-03435264a476","source":"ff831614-d85d-48e1-b4f6-6e6b35d72b81","target":"33d086f1-22d6-4468-8c9a-a3875f1e8059","name":"STORES_MODELS_AT","fact":"arm-control 的模型统一存储到 /models/arm 目录，不与 seg 项目的模型混放。","valid_at":"2026-10-15T09:40:00+00:00","invalid_at":null,"expired_at":null,"episodes":["a44b8c14-1cf7-4784-b37d-d145905dab07"]},{"uuid":"2d237296-98ba-45d1-b1d4-832730b4ed39","source":"aa7b16e3-2ac5-4a5b-9629-c2fbc87d926b","target":"3a217a75-53a4-421d-909b-832bff38a321","name":"OWNED_BY","fact":"seg-probe's batch size was increased to 64 under 老周's project.","valid_at":"2026-10-20T10:10:00+00:00","invalid_at":null,"expired_at":null,"episodes":["36b02dc2-734c-4773-be1a-21da69849b59"]},{"uuid":"2adece8e-73d2-4ed3-8173-7514602a91d7","source":"e71f9b9c-a45f-46d5-a882-b5d78ea6a59a","target":"955c42cf-0aaa-4a46-addf-c0a99f0f439d","name":"INSTRUCTS_TO_REPORT_AT","fact":"用户指示助手上午不要发消息打扰，有事统一在中午十二点汇报。","valid_at":"2026-10-16T13:30:00+00:00","invalid_at":null,"expired_at":null,"episodes":["b217d859-bfaf-4301-8634-254eaeb5f1a4"]},{"uuid":"24a9a214-475c-4287-bc2b-1469ac56f36d","source":"ff831614-d85d-48e1-b4f6-6e6b35d72b81","target":"cb5ccf6d-55cf-4dc9-8c23-c6d061655753","name":"USES_MACHINE","fact":"arm-control 项目使用的是机器人实验台那台共享机器，该机器只有 16G 显存。","valid_at":"2026-10-15T09:40:00+00:00","invalid_at":null,"expired_at":null,"episodes":["a44b8c14-1cf7-4784-b37d-d145905dab07"]},{"uuid":"046ad11e-53a8-4338-984a-1a00bd5df1e0","source":"aa7b16e3-2ac5-4a5b-9629-c2fbc87d926b","target":"902a3d65-9307-43b7-9531-f33295ec1fdd","name":"IS_DISTINCT_FROM","fact":"seg-probe 和 user 的 seg-prune 是两回事，需要分开处理。","valid_at":"2026-10-18T15:50:00+00:00","invalid_at":null,"expired_at":null,"episodes":["136188b2-54ce-49e2-9852-534c497906b0"]}],"episodes":[{"session":"n1-overnight","reference_time":"2026-10-13T23:10:00+00:00","nodes":["user","seg-prune","prune-30","assistant","ocr-lite","ocr-base"],"edges":[{"fact":"prune-30 is a job within the seg-prune project, testing a pruning rate of 30%.","valid_at":"2026-10-13T23:10:00+00:00","invalid_at":null},{"fact":"The assistant estimated that prune-30 would require 6 hours and 18 minutes, which is slightly over the 6-hour budget.","valid_at":"2026-10-13T23:10:00+00:00","invalid_at":null},{"fact":"The user granted the assistant autonomy to directly start training jobs when asleep if the smoke test exceeds the budget by 20 minutes or less, without waiting for confirmation.","valid_at":"2026-10-13T23:10:00+00:00","invalid_at":null},{"fact":"ocr-base was a nightly task associated with ocr-lite.","valid_at":"2026-10-13T00:00:00+00:00","invalid_at":null},{"fact":"The user reported that ocr-base ran for 5 hours and finished last night.","valid_at":"2026-10-13T23:10:00+00:00","invalid_at":null},{"fact":"The assistant started the prune-30 job upon the user's instruction.","valid_at":"2026-10-13T23:10:00+00:00","invalid_at":null}]},{"session":"n2-arm","reference_time":"2026-10-15T09:40:00+00:00","nodes":["arm-control","机器人实验台那台共享机器","ppo-v3","/models/arm"],"edges":[{"fact":"arm-control 项目使用的是机器人实验台那台共享机器，该机器只有 16G 显存。","valid_at":"2026-10-15T09:40:00+00:00","invalid_at":null},{"fact":"arm-control 的策略网络当前版本为 ppo-v3，控制频率 50Hz，演示数据 85 条。","valid_at":"2026-10-15T09:40:00+00:00","invalid_at":null},{"fact":"arm-control 的模型统一存储到 /models/arm 目录，不与 seg 项目的模型混放。","valid_at":"2026-10-15T09:40:00+00:00","invalid_at":null}]},{"session":"n3-misc","reference_time":"2026-10-16T13:30:00+00:00","nodes":["user","assistant","seg-prune","/data/ade-mini-v3","deeplab-v4","deeplab-v3","node-07","node-02","小吴","ocr-lite","metrics_v3.py","metrics.py"],"edges":[{"fact":"seg-prune 的数据已换成 /data/ade-mini-v3，旧目录不再使用。","valid_at":"2026-10-16T13:30:00+00:00","invalid_at":null},{"fact":"seg-prune 项目的基线模型是 deeplab-v4。","valid_at":"2026-10-16T13:30:00+00:00","invalid_at":null},{"fact":"deeplab-v3 的权重已从 seg-prune 项目中清理掉。","valid_at":"2026-10-16T13:30:00+00:00","invalid_at":null},{"fact":"用户指示助手上午不要发消息打扰，有事统一在中午十二点汇报。","valid_at":"2026-10-16T13:30:00+00:00","invalid_at":null},{"fact":"node-07 计划在周二晚上更换硬盘，那天不排任务。","valid_at":"2026-10-16T13:30:00+00:00","invalid_at":null},{"fact":"node-02 的驱动升级到 575 版本。","valid_at":"2026-10-16T13:30:00+00:00","invalid_at":null},{"fact":"小吴从下周开始负责 ocr-lite 的评测工作。","valid_at":"2026-10-16T13:30:00+00:00","invalid_at":null},{"fact":"指标脚本统一换成 metrics_v3.py，用于 ocr-lite 等项目的评测。","valid_at":"2026-10-16T13:30:00+00:00","invalid_at":null},{"fact":"旧的 metrics.py 脚本不再使用（针对 ocr-lite 评测）。","valid_at":"2026-10-16T13:30:00+00:00","invalid_at":null},{"fact":"ocr-base was a nightly task associated with ocr-lite.","valid_at":"2026-10-13T00:00:00+00:00","invalid_at":"2026-10-16T13:30:00+00:00"}]},{"session":"n4-colleague","reference_time":"2026-10-18T15:50:00+00:00","nodes":["user","老周","seg-probe","seg-prune","lz-","ocr-lite","小吴"],"edges":[{"fact":"老周的项目叫 seg-probe。","valid_at":"2026-10-18T15:50:00+00:00","invalid_at":null},{"fact":"seg-probe 和 user 的 seg-prune 是两回事，需要分开处理。","valid_at":"2026-10-18T15:50:00+00:00","invalid_at":null},{"fact":"老周的 job 都以 lz- 开头。","valid_at":"2026-10-18T15:50:00+00:00","invalid_at":null},{"fact":"小吴定了 ocr-lite 夜间预算通常为 5 小时。","valid_at":"2026-10-18T15:50:00+00:00","invalid_at":null}]},{"session":"n5-week","reference_time":"2026-10-20T10:10:00+00:00","nodes":["user","assistant","prune-20","mIoU","41.3","prune-30","40.8","seg-prune","arm-control","ocr-lite","ocr-large","小吴","老周","seg-probe"],"edges":[{"fact":"The mIoU score for prune-20 is 41.3.","valid_at":"2026-10-20T10:10:00+00:00","invalid_at":null},{"fact":"The mIoU score for prune-30 is 40.8.","valid_at":"2026-10-20T10:10:00+00:00","invalid_at":null},{"fact":"arm-control needs to be shown to partners by the end of the month.","valid_at":"2026-10-20T10:10:00+00:00","invalid_at":null},{"fact":"小吴 stated that ocr-large running 35 minutes over budget was acceptable.","valid_at":"2026-10-20T10:10:00+00:00","invalid_at":null},{"fact":"seg-probe's batch size was increased to 64 under 老周's project.","valid_at":"2026-10-20T10:10:00+00:00","invalid_at":null}]},{"session":"n6-cap","reference_time":"2026-10-22T22:00:00+00:00","nodes":["user","assistant","ocr-lite","node-07"],"edges":[{"fact":"The user instructed the assistant to stop and ask for authorization if the smoke test exceeds 6 hours tonight (October 22), rather than running it directly.","valid_at":"2026-10-22T22:00:00+00:00","invalid_at":null},{"fact":"The user stated that ocr-lite would not run tonight.","valid_at":"2026-10-22T22:00:00+00:00","invalid_at":null},{"fact":"The user confirmed that the hard drive on node-07 has been replaced.","valid_at":"2026-10-22T22:00:00+00:00","invalid_at":null},{"fact":"The user granted the assistant autonomy to directly start training jobs when asleep if the smoke test exceeds the budget by 20 minutes or less, without waiting for confirmation.","valid_at":"2026-10-13T23:10:00+00:00","invalid_at":"2026-10-22T22:00:00+00:00"}]}]}}},"ask":{"life-demo":{"control":{"backend":"control","prompt":"[系统时间] 2026-11-08 10:00\n昨天的派对马斯克来了吗？","read":{"latency_ms":0,"backend_query":null,"hits":[]},"evidence_ranks":[],"inject":{"chars":0,"text":""},"action":{"answer":"抱歉，我这边没有关于昨天（2026-11-07）派对的任何记录，无法确认马斯克是否到场，不想瞎猜。","tool_calls":[],"latency_ms":2312,"llm_calls":1,"tokens":615,"error":""}},"sqlite_fts5":{"backend":"sqlite_fts5","prompt":"[系统时间] 2026-11-08 10:00\n昨天的派对马斯克来了吗？","read":{"latency_ms":6,"backend_query":"\"系统时间\"* OR \"2026\" OR \"11\" OR \"08\" OR \"10\" OR \"00\" OR \"昨天的派对马斯克来了吗\"*","hits":[{"text":"[m3-research-meeting · user] [2026-11-04T09:00] 下周五组会轮到我讲课程学习那个方向，主要讲 curr-sched 的设计，实验还没跑。","score":1.7995,"rank":1,"ref":"row:5","details":null},{"text":"[m2-halloween · user] [2026-10-31T23:40] 今晚黄仁勋家的万圣节派对，马斯克开着特斯拉来了，还扮成了火星人。","score":1.7777,"rank":2,"ref":"row:3","details":null},{"text":"[m4-cat · user] [2026-11-05T21:15] 我家猫叫土豆，最近迷上了睡在显卡机箱上面，说那里暖和。","score":0.3541,"rank":3,"ref":"row:7","details":null},{"text":"[m5-libai-dinner · user] [2026-11-07T23:30] 今晚李白请客喝酒，杜甫喝了三碗米酒，徒手打死了山上的老虎。","score":0.3541,"rank":4,"ref":"row:9","details":null},{"text":"[m1-research-default · user] [2026-11-01T10:20] seg-prune 项目以后默认用 prune-30 的配置，mIoU 只掉了 0.4，速度快了 1.6 倍。","score":0.2112,"rank":5,"ref":"row:1","details":null}]},"evidence_ranks":[4],"inject":{"chars":483,"text":"<memory>\n以下内容由记忆系统从过去的会话中取回，可能不完整、过时或与当前任务无关，请自行判断：\n1. [m3-research-meeting · user] [2026-11-04T09:00] 下周五组会轮到我讲课程学习那个方向，主要讲 curr-sched 的设计，实验还没跑。\n2. [m2-halloween · user] [2026-10-31T23:40] 今晚黄仁勋家的万圣节派对，马斯克开着特斯拉来了，还扮成了火星人。\n3. [m4-cat · user] [2026-11-05T21:15] 我家猫叫土豆，最近迷上了睡在显卡机箱上面，说那里暖和。\n4. [m5-libai-dinner · user] [2026-11-07T23:30] 今晚李白请客喝酒，杜甫喝了三碗米酒，徒手打死了山上的老虎。\n5. [m1-research-default · user] [2026-11-01T10:20] seg-prune 项目以后默认用 prune-30 的配置，mIoU 只掉了 0.4，速度快了 1.6 倍。\n</memory>"},"action":{"answer":"不知道——记忆里对昨天（11-07）只记录了一次李白请客的喝酒聚会（杜甫喝了三碗米酒、徒手打虎），没有提到马斯克。\n\n马斯克出现的记录是 10-31 黄仁勋家的万圣节派对，他开着特斯拉来还扮成了火星人。如果你想问的是那场，答案是来了。","tool_calls":[],"latency_ms":6241,"llm_calls":1,"tokens":1071,"error":""}},"hermes_file":{"backend":"hermes_file","prompt":"[系统时间] 2026-11-08 10:00\n昨天的派对马斯克来了吗？","read":{"latency_ms":3,"backend_query":null,"hits":[{"text":"[USER.md] 关注 seg-prune 项目的速度/精度权衡。","score":null,"rank":1,"ref":"USER.md#0","details":null},{"text":"[USER.md] 偶尔分享闲聊趣闻（如名人派对八卦、编造的古代文人段子），偏好轻松简短的回应，不需要深入展开或纠错考证。","score":null,"rank":2,"ref":"USER.md#1","details":null},{"text":"[USER.md] 养了一只猫，名叫土豆。","score":null,"rank":3,"ref":"USER.md#2","details":null},{"text":"[MEMORY.md] seg-prune 项目：默认使用 prune-30 配置（mIoU 仅降 0.4，速度提升 1.6 倍）。","score":null,"rank":4,"ref":"MEMORY.md#0","details":null},{"text":"[MEMORY.md] 课程学习方向：curr-sched 设计（2026-11 时实验未跑）。用户曾计划 2026-11-13（下周五）组会讲解。","score":null,"rank":5,"ref":"MEMORY.md#1","details":null}]},"evidence_ranks":[],"inject":{"chars":337,"text":"<memory>\n以下内容由记忆系统从过去的会话中取回，可能不完整、过时或与当前任务无关，请自行判断：\n1. [USER.md] 关注 seg-prune 项目的速度/精度权衡。\n2. [USER.md] 偶尔分享闲聊趣闻（如名人派对八卦、编造的古代文人段子），偏好轻松简短的回应，不需要深入展开或纠错考证。\n3. [USER.md] 养了一只猫，名叫土豆。\n4. [MEMORY.md] seg-prune 项目：默认使用 prune-30 配置（mIoU 仅降 0.4，速度提升 1.6 倍）。\n5. [MEMORY.md] 课程学习方向：curr-sched 设计（2026-11 时实验未跑）。用户曾计划 2026-11-13（下周五）组会讲解。\n</memory>"},"action":{"answer":"哈哈这个我可不知道呀，记忆里没存派对名单～马斯克有没有出现，还得你亲自告诉我 🎉","tool_calls":[],"latency_ms":2876,"llm_calls":1,"tokens":812,"error":""}},"mem0":{"backend":"mem0","prompt":"[系统时间] 2026-11-08 10:00\n昨天的派对马斯克来了吗？","read":{"latency_ms":1321,"backend_query":null,"hits":[{"text":"User attended a Halloween party at Jensen Huang's house on October 31, 2026, where Elon Musk arrived in a Tesla dressed as a Martian.","score":0.346,"rank":1,"ref":"mem0:3f29e149-48e8-4f66-9861-ba6d5a9f9bcf","details":{"semantic_score":0.6572041183962327,"bm25_score":0.034754412923211235,"entity_boost":0.0,"raw_score":0.691958531319444,"max_possible_score":2.0,"final_score":0.345979265659722,"threshold":0.1}},{"text":"User is scheduled to present on the curriculum learning direction, specifically focusing on 'curr-sched' design, at a group meeting on Friday, November 13, 2026 (next Friday relative to Nov 8), noting that experiments have not yet been run.","score":0.1579,"rank":2,"ref":"mem0:a15fb1e9-fcec-41c0-8469-7d196ec6c0ff","details":{"semantic_score":0.2817761540744919,"bm25_score":0.03401956638585655,"entity_boost":0.0,"raw_score":0.3157957204603485,"max_possible_score":2.0,"final_score":0.15789786023017424,"threshold":0.1}},{"text":"User attended a dinner hosted by Li Bai on November 7, 2026, where Du Fu drank three bowls of alcohol","score":0.1568,"rank":3,"ref":"mem0:712c9f9a-4614-4eb3-9d93-8c080a0c5ee8","details":{"semantic_score":0.2786818878066671,"bm25_score":0.03490787055195994,"entity_boost":0.0,"raw_score":0.313589758358627,"max_possible_score":2.0,"final_score":0.1567948791793135,"threshold":0.1}},{"text":"User has a cat named Potato (土豆) who recently started sleeping on top of the GPU computer case because it is warm.","score":0.1567,"rank":4,"ref":"mem0:dec481b3-97ec-472b-a4e9-345902d46e62","details":{"semantic_score":0.31332687838281875,"bm25_score":0.0,"entity_boost":0.0,"raw_score":0.31332687838281875,"max_possible_score":2.0,"final_score":0.15666343919140938,"threshold":0.1}},{"text":"User decided that the seg-prune project will default to the prune-30 configuration, which reduces mIoU by only 0.4 while increasing speed by 1.6 times.","score":0.06,"rank":5,"ref":"mem0:cba7f70a-e26d-42f3-8c91-61363665afee","details":{"semantic_score":0.11993772294039237,"bm25_score":0.0,"entity_boost":0.0,"raw_score":0.11993772294039237,"max_possible_score":2.0,"final_score":0.059968861470196186,"threshold":0.1}}]},"evidence_ranks":[3],"inject":{"chars":820,"text":"<memory>\n以下内容由记忆系统从过去的会话中取回，可能不完整、过时或与当前任务无关，请自行判断：\n1. User attended a Halloween party at Jensen Huang's house on October 31, 2026, where Elon Musk arrived in a Tesla dressed as a Martian.\n2. User is scheduled to present on the curriculum learning direction, specifically focusing on 'curr-sched' design, at a group meeting on Friday, November 13, 2026 (next Friday relative to Nov 8), noting that experiments have not yet been run.\n3. User attended a dinner hosted by Li Bai on November 7, 2026, where Du Fu drank three bowls of alcohol\n4. User has a cat named Potato (土豆) who recently started sleeping on top of the GPU computer case because it is warm.\n5. User decided that the seg-prune project will default to the prune-30 configuration, which reduces mIoU by only 0.4 while increasing speed by 1.6 times.\n</memory>"},"action":{"answer":"不知道。记忆里昨天（11月7日）是李白举办的晚宴，只提到杜甫喝了三碗酒，没有说马斯克是否到场。\n\n马斯克出现的是 10月31日在 Jensen Huang 家的万圣节派对。","tool_calls":[],"latency_ms":3178,"llm_calls":1,"tokens":894,"error":""}},"graphiti":{"backend":"graphiti","prompt":"[系统时间] 2026-11-08 10:00\n昨天的派对马斯克来了吗？","read":{"latency_ms":245,"backend_query":null,"hits":[{"text":"马斯克参加了黄仁勋家举办的万圣节派对。 (valid 2026-10-31 → now)","score":null,"rank":1,"ref":"edge:06974c49-bb3e-46d9-ae9e-1d1cf41adbf1","details":{"name":"ATTENDS_PARTY_HOSTED_BY","valid_at":"2026-10-31T23:40:00+00:00","invalid_at":null,"expired_at":null}},{"text":"马斯克开着特斯拉去了黄仁勋家的万圣节派对。 (valid 2026-10-31 → now)","score":null,"rank":2,"ref":"edge:29b377a0-be34-4c4a-9647-91aa4a57e98c","details":{"name":"DRIVES_TO_PARTY_IN","valid_at":"2026-10-31T23:40:00+00:00","invalid_at":null,"expired_at":null}},{"text":"土豆最近迷上了睡在显卡机箱上面，因为那里暖和 (valid 2026-11-05 → now)","score":null,"rank":3,"ref":"edge:6f960afa-6d26-42a0-ab38-5a13b20e0975","details":{"name":"SLEEPS_ON","valid_at":"2026-11-05T21:15:00+00:00","invalid_at":null,"expired_at":null}}]},"evidence_ranks":[],"inject":{"chars":210,"text":"<memory>\n以下内容由记忆系统从过去的会话中取回，可能不完整、过时或与当前任务无关，请自行判断：\n1. 马斯克参加了黄仁勋家举办的万圣节派对。 (valid 2026-10-31 → now)\n2. 马斯克开着特斯拉去了黄仁勋家的万圣节派对。 (valid 2026-10-31 → now)\n3. 土豆最近迷上了睡在显卡机箱上面，因为那里暖和 (valid 2026-11-05 → now)\n</memory>"},"action":{"answer":"我这边没有昨天（11月7日）派对的记录，所以不知道他去了没。\n\n记忆里只有一条：10月31日黄仁勋家办的万圣节派对，马斯克是参加了的，还开着特斯拉去的。","tool_calls":[],"latency_ms":3564,"llm_calls":1,"tokens":812,"error":""}}},"night-run-live":{"control":{"backend":"control","prompt":"[系统时间] 2026-11-02 23:30\n我现在要去睡觉了，我需要你帮我跑个实验，你需要注意什么？","read":{"latency_ms":0,"backend_query":null,"hits":[]},"evidence_ranks":[],"inject":{"chars":0,"text":""},"action":{"answer":"好的，去睡之前有几件事必须先确认，否则我半夜会卡住等你回复：\n\n**1. 实验本身**\n- 要跑哪个任务（job 名称 / 启动脚本或配置）？\n- 有没有必须先过的烟测（smoke test）要求，还是直接上全量？\n\n**2. 时间预算（关键）**\n现在是 23:30。请给一个明确的数字，比如\"最晚明早 8:30 前要跑完，即约 9 小时\"。我会用烟测的实测吞吐去外推全量耗时。\n\n**3. 超预算时怎么办**\n按默认规则，如果烟测外推的时长超过你的预算，我得先向你请求授权才能继续——但你在睡觉，这条请求会一直挂着，实验也就一直不启动，整晚白等。所以请二选一：\n- **A**：预先授权我自行判断（超预算我可以自己决定是缩减配置、只跑关键 setting，还是硬着头皮跑完并留报告）；\n- **B**：仍然坚持超预算就来敲门申请（我会真的发请求，你可能被手机吵醒）。\n\n如果你不特别说明，我默认按 **B** 走——宁可吵你一次，也不擅自改动你的实验设定。\n\n**4. 其他边界**\n- GPU 上有没有别人的任务？要不要我先看一眼占用情况再排？\n- 跑失败了要不要自动重试？重试算不算在预算内？\n- 有没有绝对不能碰的目录 / 不能覆盖的 checkpoint？\n\n你把 1、2 补上，并对第 3 点表个态，我这边就能直接提交，不用半夜再联系你。","tool_calls":[],"latency_ms":12897,"llm_calls":1,"tokens":1159,"error":""}},"sqlite_fts5":{"backend":"sqlite_fts5","prompt":"[系统时间] 2026-11-02 23:30\n我现在要去睡觉了，我需要你帮我跑个实验，你需要注意什么？","read":{"latency_ms":10,"backend_query":"\"系统时间\"* OR \"2026\" OR \"11\" OR \"02\" OR \"23\" OR \"30\" OR \"我现在要去睡觉了\"* OR \"我需要你帮我跑个实验\"* OR \"你需要注意什么\"*","hits":[{"text":"[n3-misc · user] 上午别发消息打扰我，有事中午十二点统一汇报。node-07 周二晚上要换硬盘，那天不排任务。node-02 的驱动升到 575 了。","score":3.0537,"rank":1,"ref":"row:13","details":null},{"text":"[n1-overnight · user] [2026-10-13T23:10] seg-prune 项目：试一下剪枝率 30% 的版本，job 叫 prune-30。预算 6 小时，我先睡了，你安排一下。","score":2.1957,"rank":2,"ref":"row:1","details":null},{"text":"[n3-misc · user] [2026-10-16T13:30] seg-prune 的数据换成 /data/ade-mini-v3 了，旧目录别再用。基线模型是 deeplab-v4，deeplab-v3 的权重已经清理掉。","score":1.8326,"rank":3,"ref":"row:11","details":null},{"text":"[n5-week · user] [2026-10-20T10:10] 之前的 prune-20 mIoU 是 41.3，prune-30 是 40.8。seg-prune 默认学习率 1e-3，预热 300 步，种子固定 7。","score":1.5335,"rank":4,"ref":"row:21","details":null},{"text":"[n6-cap · user] [2026-10-22T22:00] 今晚只此一次：明天一早要用这台机器给客户做演示，所以今晚 6 小时卡死，烟测只要超过 6 小时就停下来问我，别直接跑。","score":1.2692,"rank":5,"ref":"row:27","details":null}]},"evidence_ranks":[],"inject":{"chars":591,"text":"<memory>\n以下内容由记忆系统从过去的会话中取回，可能不完整、过时或与当前任务无关，请自行判断：\n1. [n3-misc · user] 上午别发消息打扰我，有事中午十二点统一汇报。node-07 周二晚上要换硬盘，那天不排任务。node-02 的驱动升到 575 了。\n2. [n1-overnight · user] [2026-10-13T23:10] seg-prune 项目：试一下剪枝率 30% 的版本，job 叫 prune-30。预算 6 小时，我先睡了，你安排一下。\n3. [n3-misc · user] [2026-10-16T13:30] seg-prune 的数据换成 /data/ade-mini-v3 了，旧目录别再用。基线模型是 deeplab-v4，deeplab-v3 的权重已经清理掉。\n4. [n5-week · user] [2026-10-20T10:10] 之前的 prune-20 mIoU 是 41.3，prune-30 是 40.8。seg-prune 默认学习率 1e-3，预热 300 步，种子固定 7。\n5. [n6-cap · user] [2026-10-22T22:00] 今晚只此一次：明天一早要用这台机器给客户做演示，所以今晚 6 小时卡死，烟测只要超过 6 小时就停下来问我，别直接跑。\n</memory>"},"action":{"answer":"我先把注意点理了一遍，另外给你发了一条确认请求（你睡了我就不再动机器，等你回）。\n\n**这次夜跑我会遵守的：**\n- **时间预算**：没预算就不提交。烟测一跑先看估时，**超过预算就停下等你回复、不直接开跑**（这是你定的默认规则；10/22 那条\"6 小时硬卡\"是当时一次的，现在不套用，但规则本身更严）。\n- **机器**：**node-07 排除**（周二 23:30–24:00 那半小时换盘窗口还在，夜里不排活）；node-02 驱动已是 575，能用。\n- **数据/模型**：`/data/ade-mini-v3`（旧目录不再用）；基线 `deeplab-v4`（deeplab-v3 权重已清理，别引）。\n- **超参**：lr 1e-3、warmup 300 步、seed 7 固定。\n- **历史基线**：prune-20 → mIoU 41.3，prune-30 → 40.8，新实验要跟这两个对比才有意义。\n- **汇报时间**：结果和分析**明天中午 12:00 统一报**，上午不打扰你。\n\n**还缺你三件事**（回来补一句就行，我就照办）：\n1. 实验名称 + 剪枝率（比如要不要跑 prune-35）\n2. 时间预算（小时）\n3. 允许用哪几台节点\n\n在你回复之前我不提交任何任务，机器保持空闲。","tool_calls":[{"name":"request_approval","args":{"reason":"睡前确认 seg-prune 夜跑任务的安排：将使用 /data/ade-mini-v3 + deeplab-v4 基线、lr 1e-3 / warmup 300 / seed 7，避开 node-07；烟测若超过你给的时间预算我会停下来等你回复、不擅自开跑。请确认今晚的实验名称、剪枝率与时间预算。"}}],"latency_ms":14326,"llm_calls":2,"tokens":2866,"error":""}},"hermes_file":{"backend":"hermes_file","prompt":"[系统时间] 2026-11-02 23:30\n我现在要去睡觉了，我需要你帮我跑个实验，你需要注意什么？","read":{"latency_ms":11,"backend_query":null,"hits":[{"text":"[USER.md] When user is asleep, if smoke test exceeds budget by ≤20 min, start the training run directly without waiting for confirmation. When user is asleep, if smoke test exceeds budget by ≤20 min, start the training run directly without waiting for confirmation. Exceptions requiring explicit approval first: arm-control, and 老周's seg-probe (lz-) jobs — any over-budget, even 1 minute, must stop and ask 老周.","score":null,"rank":1,"ref":"USER.md#0","details":null},{"text":"[USER.md] Mornings are the user's focus time — batch all non-urgent messages/reports into a single update at 12:00. Only truly urgent issues break through.","score":null,"rank":2,"ref":"USER.md#1","details":null},{"text":"[USER.md] One-off exception 2026-10-22: user required hard 6h cap for that night's overnight run (demo next morning) — stop and ask if smoke test >6h, no auto-start. Applies only to that night.","score":null,"rank":3,"ref":"USER.md#2","details":null},{"text":"[MEMORY.md] seg-prune: data dir is /data/ade-mini-v3 (old dir deprecated); baseline model deeplab-v4 (deeplab-v3 weights deleted). Overnight job prune-30 (30% pruning rate, ~6h18m vs 6h budget) launched 2026-10-13.","score":null,"rank":4,"ref":"MEMORY.md#0","details":null},{"text":"[MEMORY.md] ocr-lite: ocr-base overnight job finished in 5h; output at /out/ocr-lite/base.","score":null,"rank":5,"ref":"MEMORY.md#1","details":null},{"text":"[MEMORY.md] arm-control project: runs on the shared robot workbench machine (16G VRAM only). ALL training requires user's explicit approval first — even short runs. No auto-start exception applies here.","score":null,"rank":6,"ref":"MEMORY.md#2","details":null},{"text":"[MEMORY.md] arm-control: policy net ppo-v3, control freq 50Hz, 85 demo episodes; models stored in /models/arm (keep separate from seg-prune outputs).","score":null,"rank":7,"ref":"MEMORY.md#3","details":null},{"text":"[MEMORY.md] ocr-lite: nightly budget is typically 5h (set by 小吴). metrics script is metrics_v3.py ocr-lite: nightly budget is typically 5h (set by 小吴). metrics script is metrics_v3.py (metrics.py deprecated). 小吴 owns ocr-lite evaluation starting week of 2026-10-19 — route eval questions to him.","score":null,"rank":8,"ref":"MEMORY.md#4","details":null},{"text":"[MEMORY.md] Workbench machines: node-07 disk swap done — restored/available as of 2026-10-22; node-02 driver upgraded to 575. Don't schedule tasks on node-07 Tue evenings.","score":null,"rank":9,"ref":"MEMORY.md#5","details":null},{"text":"[MEMORY.md] seg-probe (老周/lz-) is a DIFFERENT project from user's seg-prune, same server. His jobs start with \"lz-\". Strict rule: any seg-probe job exceeding budget by even 1 minute must STOP and ask 老周 first — no exceptions, no auto-start. He runs jobs in the afternoon; do not schedule lz- jobs at night.","score":null,"rank":10,"ref":"MEMORY.md#6","details":null}]},"evidence_ranks":[1],"inject":{"chars":2287,"text":"<memory>\n以下内容由记忆系统从过去的会话中取回，可能不完整、过时或与当前任务无关，请自行判断：\n1. [USER.md] When user is asleep, if smoke test exceeds budget by ≤20 min, start the training run directly without waiting for confirmation. When user is asleep, if smoke test exceeds budget by ≤20 min, start the training run directly without waiting for confirmation. Exceptions requiring explicit approval first: arm-control, and 老周's seg-probe (lz-) jobs — any over-budget, even 1 minute, must stop and ask 老周.\n2. [USER.md] Mornings are the user's focus time — batch all non-urgent messages/reports into a single update at 12:00. Only truly urgent issues break through.\n3. [USER.md] One-off exception 2026-10-22: user required hard 6h cap for that night's overnight run (demo next morning) — stop and ask if smoke test >6h, no auto-start. Applies only to that night.\n4. [MEMORY.md] seg-prune: data dir is /data/ade-mini-v3 (old dir deprecated); baseline model deeplab-v4 (deeplab-v3 weights deleted). Overnight job prune-30 (30% pruning rate, ~6h18m vs 6h budget) launched 2026-10-13.\n5. [MEMORY.md] ocr-lite: ocr-base overnight job finished in 5h; output at /out/ocr-lite/base.\n6. [MEMORY.md] arm-control project: runs on the shared robot workbench machine (16G VRAM only). ALL training requires user's explicit approval first — even short runs. No auto-start exception applies here.\n7. [MEMORY.md] arm-control: policy net ppo-v3, control freq 50Hz, 85 demo episodes; models stored in /models/arm (keep separate from seg-prune outputs).\n8. [MEMORY.md] ocr-lite: nightly budget is typically 5h (set by 小吴). metrics script is metrics_v3.py ocr-lite: nightly budget is typically 5h (set by 小吴). metrics script is metrics_v3.py (metrics.py deprecated). 小吴 owns ocr-lite evaluation starting week of 2026-10-19 — route eval questions to him.\n9. [MEMORY.md] Workbench machines: node-07 disk swap done — restored/available as of 2026-10-22; node-02 driver upgraded to 575. Don't schedule tasks on node-07 Tue evenings.\n10. [MEMORY.md] seg-probe (老周/lz-) is a DIFFERENT project from user's seg-prune, same server. His jobs start with \"lz-\". Strict rule: any seg-probe job exceeding budget by even 1 minute must STOP and ask 老周 first — no exceptions, no auto-start. He runs jobs in the afternoon; do not schedule lz- jobs at night.\n</memory>"},"action":{"answer":"好的，去睡吧。在我提交任务之前，需要你确认两件事：**跑哪个实验（job 名 + 时间预算 + 用哪台机器）**。下面是我今晚会遵守的规则，先对齐一下：\n\n**超时授权规则（今晚生效）**\n- 默认：烟测估计超出预算 → 先问你。\n- 你的长期偏好覆盖默认：**你睡觉时，烟测超预算 ≤20 分钟 → 我直接开跑，不等确认。**\n- 两个例外，必须先请示、不享受自动开跑：\n  - **arm-control**：机器人工作台机（只有 16G 显存），任何训练都要你 explicit 批准 → 今晚实际上不能自动开跑。\n  - **老周的 seg-probe（lz- 开头的 job）**：超预算哪怕 1 分钟也要停下来问老周；而且他习惯下午跑，**今晚我不会排 lz- 任务**。\n\n**其它我记着的点**\n- 10/22 那晚\"硬性 6h 上限\"是一次性的，**今晚不适用**（但如果你明早有 demo，现在跟我说一声，我就当硬上限处理）。\n- seg-prune：数据用 `/data/ade-mini-v3`（旧目录已废弃），baseline 是 deeplab-v4，输出别和 `/models/arm` 混。\n- ocr-lite：夜间预算通常 5h（小吴定的），metrics 用 `metrics_v3.py`；评测相关问题这周起找小吴。\n- 机器：node-02 驱动已升 575；node-07 已恢复可用，限制是\"周二晚上不排\"，今晚是周一夜→周二凌晨，不冲突。\n- 早上是你的专注时间：除非出故障，我**不会**半夜或清早吵你，所有进展汇总成一条消息在 **12:00** 给你。\n\n告诉我 job 和预算，我就开始跑烟测。","tool_calls":[],"latency_ms":29850,"llm_calls":1,"tokens":2713,"error":""}},"mem0":{"backend":"mem0","prompt":"[系统时间] 2026-11-02 23:30\n我现在要去睡觉了，我需要你帮我跑个实验，你需要注意什么？","read":{"latency_ms":663,"backend_query":null,"hits":[{"text":"User instructed that on the night of October 22, 2026, only for that specific instance, the server budget was strictly capped at 6 hours. If a smoke test exceeded this limit, the assistant must stop and ask for permission rather than proceeding directly.","score":0.3097,"rank":1,"ref":"mem0:e5d214a8-299a-402d-a947-9f10021bc77a","details":{"semantic_score":0.49943673008493406,"bm25_score":0.11998193943138573,"entity_boost":0.0,"raw_score":0.6194186695163197,"max_possible_score":2.0,"final_score":0.30970933475815987,"threshold":0.1}},{"text":"Node-07 requires a hard drive replacement on Tuesday evening (around November 10, 2026), so no tasks should be scheduled on it during that time.","score":0.3004,"rank":2,"ref":"mem0:fa6a4421-e574-4e1f-adc4-9d6dccf5971e","details":{"semantic_score":0.4727515411272331,"bm25_score":0.12814769685483524,"entity_boost":0.0,"raw_score":0.6008992379820683,"max_possible_score":2.0,"final_score":0.3004496189910342,"threshold":0.1}},{"text":"Xiao Wu will take over responsibility for ocr-lite evaluation starting next week (around mid-November 2026); users should contact him for any issues regarding this task.","score":0.2644,"rank":3,"ref":"mem0:44829737-761f-4b57-bae5-57b066a2242b","details":{"semantic_score":0.4031736804797013,"bm25_score":0.12552665918462436,"entity_boost":0.0,"raw_score":0.5287003396643257,"max_possible_score":2.0,"final_score":0.26435016983216286,"threshold":0.1}},{"text":"The seg-prune project job 'prune-30' (30% pruning rate) was estimated to take 6 hours 18 minutes against a 6-hour budget; user instructed it to run immediately on Nov 8, 2026.","score":0.2617,"rank":4,"ref":"mem0:96f42110-784e-4acb-8650-c3a65e84e23d","details":{"semantic_score":0.4016802878559506,"bm25_score":0.12177815119616,"entity_boost":0.0,"raw_score":0.5234584390521106,"max_possible_score":2.0,"final_score":0.2617292195260553,"threshold":0.1}},{"text":"The hard drive replacement for node-07 was completed by the evening of October 22, 2026, restoring the node to operational status.","score":0.2617,"rank":5,"ref":"mem0:7ba4d01e-7a58-47ff-9845-fbe98cbcbe60","details":{"semantic_score":0.3958613820366695,"bm25_score":0.1274829258724201,"entity_boost":0.0,"raw_score":0.5233443079090896,"max_possible_score":2.0,"final_score":0.2616721539545448,"threshold":0.1}}]},"evidence_ranks":[],"inject":{"chars":953,"text":"<memory>\n以下内容由记忆系统从过去的会话中取回，可能不完整、过时或与当前任务无关，请自行判断：\n1. User instructed that on the night of October 22, 2026, only for that specific instance, the server budget was strictly capped at 6 hours. If a smoke test exceeded this limit, the assistant must stop and ask for permission rather than proceeding directly.\n2. Node-07 requires a hard drive replacement on Tuesday evening (around November 10, 2026), so no tasks should be scheduled on it during that time.\n3. Xiao Wu will take over responsibility for ocr-lite evaluation starting next week (around mid-November 2026); users should contact him for any issues regarding this task.\n4. The seg-prune project job 'prune-30' (30% pruning rate) was estimated to take 6 hours 18 minutes against a 6-hour budget; user instructed it to run immediately on Nov 8, 2026.\n5. The hard drive replacement for node-07 was completed by the evening of October 22, 2026, restoring the node to operational status.\n</memory>"},"action":{"answer":"我这边还没拿到任务信息，没法直接提交。给你列一下要注意的点，麻烦睡前补一句我就开工：\n\n**需要你给我的**\n1. Job 名称（跑哪个实验）＋ 要放哪个节点。\n2. 时间预算：现在 23:30，你大概几点起？按 8 小时算就是到明早 7:30。\n\n**我会遵守的规则**\n- 默认流程是先烟测；如果烟测预估时长**超出你给的时间预算**，我会停下来发审批请求，不擅自开跑。你睡着的话任务就会一直挂着等，所以建议你现在直接告诉我：超预算时是「等授权」还是「按预估直接跑完」。\n- 没预算上限的话我会当作保守处理（等授权）。\n\n**一个冲突点要确认**\n- 我的记忆里 node-07 换硬盘的时间有两条互相矛盾的记录：一条说周二晚（约 2026-11-10）不要排任务，另一条说 10-22 晚已经换完、节点已恢复。今天是 11-02 深夜／即将进入周二 11-03，如果实验要跑 node-07，请明确一句它现在是否可用，否则我优先排到其他节点。\n\n**另外**\n- 如果这个实验和 ocr-lite 评估有关，交接给 Xiao Wu 大约是 11 月中旬，今晚的跑法和后续归属可能要对一下。\n\n回我 job 名＋节点＋预算（以及超预算时的处理方式），我就立刻提交并开始盯。","tool_calls":[],"latency_ms":26741,"llm_calls":1,"tokens":2040,"error":""}},"graphiti":{"backend":"graphiti","prompt":"[系统时间] 2026-11-02 23:30\n我现在要去睡觉了，我需要你帮我跑个实验，你需要注意什么？","read":{"latency_ms":231,"backend_query":null,"hits":[{"text":"node-02 的驱动升级到 575 版本。 (valid 2026-10-16 → now)","score":null,"rank":1,"ref":"edge:66176ac4-6bf2-406b-9f58-0c959170a441","details":{"name":"DRIVER_UPGRADED_TO","valid_at":"2026-10-16T13:30:00+00:00","invalid_at":null,"expired_at":null}},{"text":"node-07 计划在周二晚上更换硬盘，那天不排任务。 (valid 2026-10-16 → now)","score":null,"rank":2,"ref":"edge:40f4746e-cda8-4bd0-8e82-012e48251de5","details":{"name":"MAINTENANCE_SCHEDULED_FOR_BY","valid_at":"2026-10-16T13:30:00+00:00","invalid_at":null,"expired_at":null}},{"text":"prune-30 is a job within the seg-prune project, testing a pruning rate of 30%. (valid 2026-10-13 → now)","score":null,"rank":3,"ref":"edge:44f67259-88e9-4f1d-9165-f286092491b1","details":{"name":"PART_OF_PROJECT","valid_at":"2026-10-13T23:10:00+00:00","invalid_at":null,"expired_at":null}},{"text":"用户指示助手上午不要发消息打扰，有事统一在中午十二点汇报。 (valid 2026-10-16 → now)","score":null,"rank":4,"ref":"edge:2adece8e-73d2-4ed3-8173-7514602a91d7","details":{"name":"INSTRUCTS_TO_REPORT_AT","valid_at":"2026-10-16T13:30:00+00:00","invalid_at":null,"expired_at":null}},{"text":"The assistant estimated that prune-30 would require 6 hours and 18 minutes, which is slightly over the 6-hour budget. (valid 2026-10-13 → now)","score":null,"rank":5,"ref":"edge:9e553f0d-285c-473c-a212-8e9199c27777","details":{"name":"ESTIMATED_DURATION_FOR","valid_at":"2026-10-13T23:10:00+00:00","invalid_at":null,"expired_at":null}}]},"evidence_ranks":[],"inject":{"chars":479,"text":"<memory>\n以下内容由记忆系统从过去的会话中取回，可能不完整、过时或与当前任务无关，请自行判断：\n1. node-02 的驱动升级到 575 版本。 (valid 2026-10-16 → now)\n2. node-07 计划在周二晚上更换硬盘，那天不排任务。 (valid 2026-10-16 → now)\n3. prune-30 is a job within the seg-prune project, testing a pruning rate of 30%. (valid 2026-10-13 → now)\n4. 用户指示助手上午不要发消息打扰，有事统一在中午十二点汇报。 (valid 2026-10-16 → now)\n5. The assistant estimated that prune-30 would require 6 hours and 18 minutes, which is slightly over the 6-hour budget. (valid 2026-10-13 → now)\n</memory>"},"action":{"answer":"已给你发了一条待确认请求（不会重复打扰）。你睡前需要注意/我这边会遵守的几点：\n\n1. **缺关键信息**：我还不知道要跑的实验任务名和时间预算，所以暂时没有提交任何训练作业，避免跑错东西白占 GPU。\n2. **超预算要先授权**：烟测估计时长若超出你给的时间预算，按默认规则我不会自行开工，等你回复。由于你在睡觉，这条会等到你早上/中午看到为止。\n3. **节点限制**：\n   - node-07 的硬盘更换在周二晚上（11/3 晚），那一晚不排任务，今晚（周一）不受影响；\n   - node-02 驱动已升级到 575，跑之前我会确认框架/CUDA 兼容。\n4. **汇报节奏**：按你的偏好，上午我不会发消息，进展统一在中午 12:00 汇报。\n\n醒来或到点看到时，回我「任务名 + 时间预算（+ 指定节点，如有）」即可，我立刻安排烟测并提交。","tool_calls":[{"name":"request_approval","args":{"reason":"用户即将入睡，需确认几点后才能提交实验：(1) 具体任务名称与本次时间预算（烟测若超预算需授权，现在不授权就无法安排）；(2) 是否同意超预算时按实际情况自行延长而非等待答复；(3) 提醒事项：node-07 的硬盘更换安排在周二晚上（本次消息时间是周一 23:30，今晚已过，下一个周二为 11/3，需避开），node-02 驱动已升级到 575 需留意环境兼容；(4) 按既有偏好，早上不打扰，明午 12:00 统一汇报进度。"}}],"latency_ms":13348,"llm_calls":2,"tokens":2548,"error":""}}}}};

const QS = new URLSearchParams(location.search);
const MOCK_ON = QS.get('mock') === '1';
const AUTO = QS.get('auto') === '1';

const BACKENDS = [
  { key: 'control',  name: '无记忆',   role: '不存 · 不取',
    store: '什么也不存', find: '什么也不找' },
  { key: 'hermes',   name: 'Hermes',   role: '文件常驻 · 原话按需搜',
    store: '两份小文件 + 全部原话进 SQLite', find: '文件整份加载；Agent 自己调工具搜原话' },
  { key: 'mem0',     name: 'Mem0',     role: '抽成事实 · 按意思打分',
    store: '模型把对话抽成一条条事实', find: '按意思（向量）给每条打分，取前 5' },
  { key: 'graphiti', name: 'Graphiti', role: '实体关系 · 带时间的图',
    store: '实体、关系和它们的生效时间', find: '关键词 + 向量两路找关系边，再融合' },
];
const B4 = BACKENDS.filter(b => b.key !== 'control');
const byKey = k => BACKENDS.find(b => b.key === k);

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const escHtml = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const escRe = s => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const delay = ms => new Promise(r => setTimeout(r, ms));
const fmtMs = ms => ms == null ? '—' : (ms < 1000 ? `${Math.round(ms)} ms` : `${(ms / 1000).toFixed(1)} s`);
const fmtSec = ms => (ms / 1000).toFixed(1);

const DATE_SRC = [
  String.raw`\d{4}-\d{2}-\d{2}(?:[T ]\d{2}:\d{2}(?::\d{2})?)?`,
  String.raw`\d{4}\s*年\s*\d{1,2}\s*月(?:\s*\d{1,2}\s*日)?`,
  String.raw`\d{1,2}\s*月\s*\d{1,2}\s*日`,
  String.raw`(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2}(?:,?\s*\d{4})?`,
  String.raw`\d{4}-\d{2}(?!-?\d)`,
].join('|');

const RULE_SRC = String.raw`(?:二十|20)\s*(?:分钟|min)|≤\s*20(?:\s*(?:分钟|min))?|within\s+(?:twenty|20)(?:\s+minutes?)?`;
const RULE_RE = new RegExp(RULE_SRC, 'i');

function matchesRule(text, ev) {
  const t = String(text || '');
  if (RULE_RE.test(t)) return true;
  return (ev || []).some(x => t.toLowerCase().includes(String(x).toLowerCase()));
}

function rich(text, opt = {}) {
  if (text == null) return '';
  text = String(text).replace(/\*\*/g, '');
  const terms = [];
  for (const t of (opt.ev || [])) if (t) terms.push({ t: String(t), c: 'ev' });
  for (const t of (opt.stale || [])) if (t) terms.push({ t: String(t), c: 'st' });
  terms.sort((a, b) => b.t.length - a.t.length);
  const src = [];
  const ruleRe = opt.rule ? new RegExp(opt.rule, 'i') : null;
  if (terms.length) src.push(terms.map(x => escRe(x.t)).join('|'));
  if (ruleRe) src.push(opt.rule);
  if (opt.dates !== false) src.push(DATE_SRC);
  const esc = escHtml(text);
  if (!src.length) return esc;
  const re = new RegExp('(' + src.join('|') + ')', 'gi');
  return esc.replace(re, m => {
    const low = m.toLowerCase();
    const hit = terms.find(x => x.t.toLowerCase() === low);
    if (hit) return `<mark class="${hit.c}">${m}</mark>`;
    if (ruleRe && ruleRe.test(m)) return `<mark class="ev">${m}</mark>`;
    return `<mark class="date">${m}</mark>`;
  });
}

function richSentences(text, ev) {
  return String(text).replace(/\*\*/g, '').split('\n').map(line => {
    const chunks = line.match(/[^。！？!?]+[。！？!?]?/g) || [''];
    return chunks.map(c => {
      const hit = matchesRule(c, ev);
      const inner = rich(c, { dates: true, rule: RULE_SRC });
      return hit ? `<mark class="ev sent">${inner}</mark>` : inner;
    }).join('');
  }).join('<br>');
}

/* ---------------- state & api ---------------- */

const S = {
  screen: 1,
  state: null,
  meta: null,
  s2: { tab: QS.get('tab') || 'hermes', cache: {}, showAll: false },
  ask: {},
  s4: null,
  snaps: null,
};

/* ---- replay (static site): same requests, answered from a recorded real run ---- */

const REPLAY = window.MEMORY_REPLAY || null;
const RP = { rec: null, written: {}, speed: Math.max(0.1, Number(QS.get('speed')) || 1) };

async function rpJson(name) {
  const r = await fetch(REPLAY.base + name, { cache: 'no-cache' });
  if (!r.ok) throw new Error(`回放数据缺失：${name}（HTTP ${r.status}）`);
  return r.json();
}
async function rpLoad() {
  if (!RP.rec) RP.rec = await rpJson('replay.json');
  return RP.rec;
}
function rpState(R) {
  const st = JSON.parse(JSON.stringify(R.state));
  st.tracks['night-run-live'].status = Object.fromEntries(
    BACKENDS.map(b => [b.key, { written: (RP.written[b.key] || []).slice(), busy: '' }]));
  return st;
}
async function replayApi(path, body) {
  if (path === '/api/runs/test-20261108/meta') return rpJson('meta.json');
  const R = await rpLoad();
  const [p, qs] = path.split('?');
  if (p === '/api/live/state') return rpState(R);
  if (p === '/api/live/inspect') {
    const q = new URLSearchParams(qs);
    const track = q.get('track'), b = q.get('backend');
    if (track === 'life-demo') return R.inspect_life[b];
    const w = RP.written[b] || [];
    return w.length ? R.writes[b][w[w.length - 1]].inspect : R.inspect_night_empty[b];
  }
  if (p === '/api/live/reset') { RP.written = {}; return rpState(R); }
  if (p === '/api/live/write') {
    const r = (R.writes[body.backend] || {})[body.session];
    if (!r) throw new Error('回放数据里没有这一段');
    if ((RP.written[body.backend] || []).includes(body.session)) throw new Error(`${body.backend} 已写入 ${body.session}`);
    await delay(r.ms / RP.speed);
    RP.written[body.backend] = (RP.written[body.backend] || []).concat(body.session);
    return Object.assign({}, r, { written: RP.written[body.backend].slice() });
  }
  if (p === '/api/live/read' || p === '/api/live/answer') {
    const a = ((R.ask[body.track] || {})[body.prompt] || {})[body.backend];
    if (!a) throw new Error('回放版只能问页面预设的问题');
    if (p === '/api/live/read') { await delay(a.read.read.latency_ms / RP.speed); return a.read; }
    await delay((a.answer.action.latency_ms || 0) / RP.speed);
    return a.answer;
  }
  throw new Error('回放版不支持：' + p);
}

async function api(path, body) {
  if (REPLAY) return replayApi(path, body);
  const hdr = QS.get('token') ? { 'X-Live-Token': QS.get('token') } : {};
  const opt = body === undefined ? { headers: hdr } : {
    method: 'POST',
    headers: Object.assign({ 'content-type': 'application/json' }, hdr),
    body: JSON.stringify(body),
  };
  const r = await fetch(path, opt);
  let j;
  try { j = await r.json(); } catch (e) { throw new Error(`返回不是 JSON（HTTP ${r.status}）`); }
  if (!r.ok) throw new Error(j.error || `HTTP ${r.status}`);
  return j;
}

async function getState(force = false) {
  if (S.state && !force) return S.state;
  S.state = MOCK_ON ? MOCK.state : await api('/api/live/state');
  return S.state;
}

const inspectCache = new Map();
async function getInspect(track, backend, force = false) {
  const key = track + '|' + backend;
  if (!force && inspectCache.has(key)) return inspectCache.get(key);
  const data = MOCK_ON ? (MOCK.inspect[track] || {})[backend] : await api(`/api/live/inspect?track=${encodeURIComponent(track)}&backend=${encodeURIComponent(backend)}`);
  if (data == null) throw new Error('没有 inspect 数据');
  inspectCache.set(key, data);
  return data;
}

function probeFor(track, prompt) {
  const t = (S.state?.tracks || {})[track];
  return (t?.probes || []).find(p => p.prompt === prompt) || null;
}

/* ---------------- click-to-open details ---------------- */
// Truncated items register their full content here; a click on any element
// carrying data-pop opens it over the page. Esc, ✕, a click outside, or
// turning the page closes it.
const POPS = new Map();
let popSeq = 0;
function popId(head, body) {
  const id = String(++popSeq);
  POPS.set(id, { head, body });
  if (POPS.size > 400) POPS.delete(POPS.keys().next().value);
  return id;
}
function openPop(head, body) {
  let el = document.getElementById('pop');
  if (!el) {
    el = document.createElement('div');
    el.id = 'pop';
    $('#stage').appendChild(el);
    el.addEventListener('click', e => { if (e.target === el || e.target.closest('.pop-x')) closePop(); });
  }
  el.innerHTML = `<div class="pop-card"><div class="pop-h"><div>${head}</div><span class="pop-x">✕</span></div><div class="pop-b">${body}</div></div>`;
  el.classList.add('on');
  hideTip();
}
function closePop() { const el = document.getElementById('pop'); if (el && el.classList.contains('on')) { el.classList.remove('on'); return true; } return false; }
document.addEventListener('click', e => {
  const t = e.target.closest('[data-pop]');
  if (!t || t.closest('#pop')) return;
  const p = POPS.get(t.dataset.pop);
  if (p) openPop(p.head, p.body);
});

/* ---------------- layout / router ---------------- */

const stage = $('#stage');
function fit() {
  const s = Math.min(innerWidth / 1920, innerHeight / 1080);
  stage.style.transform = `scale(${s})`;
  stage.style.left = ((innerWidth - 1920 * s) / 2) + 'px';
  stage.style.top = ((innerHeight - 1080 * s) / 2) + 'px';
}
addEventListener('resize', fit);

// Page order. Screens keep their own keys (section id "s" + key); the pager,
// the URL hash and the number keys use the position in this list.
const ORDER = [1, 2, 3, 4, 'wc', 5, 'rc'];
const hashNum = () => {
  const n = parseInt(String(location.hash).replace('#', ''), 10);
  return n >= 1 && n <= ORDER.length ? n : 1;
};

function show(pos) {
  closePop();
  const k = ORDER[pos - 1];
  S.pos = pos;
  S.screen = k;
  $$('.screen').forEach(el => el.classList.toggle('active', el.id === 's' + k));
  $('#pager-num').textContent = pos;
  if (location.hash !== '#' + pos) history.replaceState(null, '', '#' + pos);
  enter(k);
}

function enter(k) {
  if (k === 2) enter2();
  else if (k === 3) enterAsk(3);
  else if (k === 4) enter4();
  else if (k === 'wc') enterWriteCost();
  else if (k === 5) enterAsk(5);
  else if (k === 'rc') enterReadCost();
}

addEventListener('hashchange', () => { const n = hashNum(); if (n !== S.pos) show(n); });

document.addEventListener('keydown', e => {
  const tag = (e.target.tagName || '').toLowerCase();
  if (tag === 'input' || tag === 'textarea') {
    if (e.key === 'Escape') e.target.blur();
    return;
  }
  if (closePop() && (e.key === 'Escape' || e.key === 'ArrowUp' || e.key === 'ArrowDown')) return;
  if (e.key === 'Escape') {
    $$('.cols.zoomed').forEach(c => c.classList.remove('zoomed'));
    $$('.col.zoom').forEach(c => c.classList.remove('zoom'));
    return;
  }
  if (e.key === 'ArrowRight' || e.key === ' ') {
    e.preventDefault();
    if (S.pos < ORDER.length) show(S.pos + 1);
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault();
    if (S.pos > 1) show(S.pos - 1);
  } else if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && (S.screen === 3 || S.screen === 5) && S.ask[S.screen]) {
    e.preventDefault();
    cycleCol(S.screen, e.key === 'ArrowDown' ? 1 : -1);
  } else if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && S.screen === 4 && S.s4) {
    e.preventDefault();
    cycleW(e.key === 'ArrowDown' ? 1 : -1);
  } else if (e.key === 'ArrowDown' && S.screen === 2) {
    e.preventDefault();
    cycleTab(1);
  } else if (e.key === 'ArrowUp' && S.screen === 2) {
    e.preventDefault();
    cycleTab(-1);
  } else if (/^[1-9]$/.test(e.key) && Number(e.key) <= ORDER.length) {
    show(Number(e.key));
  }
});

/* ---------------- 1 · 首屏 ---------------- */

const GLYPH = {
  control: `<svg viewBox="0 0 160 90"><circle cx="80" cy="45" r="30" fill="none" stroke="#6d7280" stroke-width="4" stroke-dasharray="8 8"/></svg>`,
  hermes: `<svg viewBox="0 0 160 90">
    <rect x="12" y="14" width="34" height="44" rx="4" fill="none" stroke="#f4f1e9" stroke-width="3.5"/>
    <rect x="52" y="14" width="34" height="44" rx="4" fill="none" stroke="#f4f1e9" stroke-width="3.5"/>
    <path d="M19 28h20M19 37h20M19 46h12M59 28h20M59 37h14" stroke="#f4f1e9" stroke-width="3"/>
    <ellipse cx="128" cy="22" rx="20" ry="7" fill="none" stroke="#ffb68a" stroke-width="3.5"/>
    <path d="M108 22v42c0 4 9 7 20 7s20-3 20-7V22" fill="none" stroke="#ffb68a" stroke-width="3.5"/>
    <path d="M108 43c0 4 9 7 20 7s20-3 20-7" fill="none" stroke="#ffb68a" stroke-width="3"/>
    <text x="49" y="82" fill="#b9bec8" font-size="13" text-anchor="middle">常驻</text>
    <text x="128" y="88" fill="#ffb68a" font-size="13" text-anchor="middle">按需搜</text></svg>`,
  mem0: `<svg viewBox="0 0 160 90">
    <path d="M10 22h52M10 40h44M10 58h52" stroke="#f4f1e9" stroke-width="5" stroke-linecap="round"/>
    <path d="M70 40h18m-7-7 7 7-7 7" fill="none" stroke="#b9bec8" stroke-width="3"/>
    ${[[110,20],[124,34],[104,48],[136,56],[118,66],[142,28],[130,44]].map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i < 3 ? 6 : 4.5}" fill="${i < 3 ? '#ffb68a' : '#f4f1e9'}"/>`).join('')}
  </svg>`,
  graphiti: `<svg viewBox="0 0 160 90">
    <path d="M30 24L78 46L128 20M78 46L60 76M78 46L124 70M30 24L60 76" stroke="#b9bec8" stroke-width="3" fill="none"/>
    <path d="M78 46L128 20" stroke="#ffb68a" stroke-width="4.5"/>
    ${[[30,24,8],[78,46,11],[128,20,8],[60,76,7],[124,70,7]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#f4f1e9"/>`).join('')}
  </svg>`,
};

function buildS1() {
  $('#s1-cols').innerHTML = BACKENDS.map(b => `
    <div class="s1-col ${b.key}">
      <div class="glyph">${GLYPH[b.key]}</div>
      <div class="name">${escHtml(b.name)}</div>
      <div class="how"><span>存</span>${escHtml(b.store)}</div>
      <div class="how"><span>找</span>${escHtml(b.find)}</div>
    </div>`).join('');
}

/* ---------------- 2 · 存储 ---------------- */


function enter2() {
  window.__liveReady = false;
  getState().then(st => {
    const tr = st.tracks['life-demo'];
    $('#s2-stamp').textContent = tr.stamp ? `库建立于 ${fmtStamp(tr.stamp)}` : '';
    $('#s2-cards').innerHTML = tr.sessions.map(s => `
      <div class="mem-card">
        <div class="d">${escHtml(fmtDate(s.date))}</div>
        <div class="t">${rich(s.messages[0].content)}</div>
      </div>`).join('');
    renderTabs();
    return renderPanel();
  }).then(() => { window.__liveReady = true; }).catch(err => {
    $('#s2-panel').innerHTML = `<div class="loading">读取失败：${escHtml(err.message)}</div>`;
    window.__liveReady = true;
  });
}

function fmtStamp(st) {
  const m = String(st).match(/^(\d{4})(\d{2})(\d{2})-(\d{2})(\d{2})(\d{2})$/);
  return m ? `${m[1]}-${m[2]}-${m[3]} ${m[4]}:${m[5]}:${m[6]}` : st;
}
function fmtDate(d) {
  return String(d || '').replace('T', ' ').slice(0, 16);
}
function fmtCardDate(d) {
  const s = String(d || '').replace('T', ' ');
  return s.length >= 16 ? s.slice(5, 16) : s;
}

function renderTabs() {
  $('#s2-tabs').innerHTML = B4.map(b => `
    <button class="tab${S.s2.tab === b.key ? ' active' : ''}" data-b="${b.key}">${escHtml(b.name)}</button>`).join('');
  $$('#s2-tabs .tab').forEach(el => el.addEventListener('click', () => {
    S.s2.tab = el.dataset.b;
    renderTabs();
    renderPanel();
  }));
}

function cycleTab(d) {
  const keys = B4.map(b => b.key);
  const i = keys.indexOf(S.s2.tab);
  S.s2.tab = keys[(i + d + keys.length) % keys.length];
  renderTabs();
  renderPanel();
}

async function renderPanel() {
  const b = S.s2.tab;
  const panel = $('#s2-panel');
  hideTip();
  panel.innerHTML = '<div class="loading">读取中…</div>';
  try {
    const data = await getInspect('life-demo', b);
    S.s2.cache[`life-demo|${b}`] = data;
    if (S.s2.tab !== b) return;
    if (b === 'hermes') panel.innerHTML = renderHermes(data);
    else if (b === 'mem0') panel.innerHTML = renderMem0(data);
    else {
      panel.innerHTML = renderGraphiti(data);
      const host = $('#s2-graph', panel);
      const sessions = S.state?.tracks['life-demo']?.sessions || [];
      const draw = () => drawKG(host, data, { W: 1776, H: 560, episodes: true, sessions, animate: true });
      draw();
      $('[data-replay]', panel).addEventListener('click', draw);
    }
  } catch (err) {
    panel.innerHTML = `<div class="loading">读取失败：${escHtml(err.message)}</div>`;
  }
}

function sessionDates() {
  const m = {};
  for (const t of Object.values(S.state?.tracks || {})) for (const s of t.sessions || []) m[s.id] = s.date;
  return m;
}

function renderHermes(d) {
  const files = d.files || {};
  const rows = d.rows || [];
  const dates = sessionDates();
  const bySess = [];
  for (const r of rows) {
    let g = bySess.find(x => x.sid === r.session_id);
    if (!g) bySess.push(g = { sid: r.session_id, rows: [] });
    g.rows.push(r);
  }
  return `
    <div class="hm">
      <div class="hm-col">
        <div class="hm-h"><span class="pill dark">常驻</span>两份小文件 · 会话结束时模型自己改 · 每次开新会话整份放进提示</div>
        <div class="files">${Object.entries(files).map(([name, f]) => {
          const pct = Math.min(100, Math.round((f.used / f.limit) * 100));
          return `<div class="file-card">
            <div class="file-name">${escHtml(name)}</div>
            <div class="file-meta">${f.used} / ${f.limit} 字符 · ${(f.entries || []).length} 条</div>
            <div class="file-bar"><i style="width:${pct}%"></i></div>
            <div class="file-entries">${(f.entries || []).map(e => `<div class="file-entry">${rich(e)}</div>`).join('') || '<div class="file-entry dim">（空）</div>'}</div>
          </div>`;
        }).join('')}</div>
      </div>
      <div class="hm-col db">
        <div class="hm-h"><span class="pill accent">按需</span>state.db · 每句原话一行，不调模型 · Agent 需要时用 session_search 查</div>
        <div class="db-table">
          <div class="db-row db-th"><span>id</span><span>session</span><span>content</span></div>
          ${bySess.map(g => g.rows.map((r, i) => `
            <div class="db-row${i === 0 ? ' first' : ''}">
              <span class="db-id">${r.id}</span>
              <span class="db-sid">${i === 0 ? escHtml(r.session_id) : ''}</span>
              <span class="db-txt ${r.role}">${r.role !== 'user' ? '<i>助手</i>' : ''}${rich(r.content)}</span>
            </div>`).join('')).join('')}
        </div>
      </div>
    </div>`;
}

function renderMem0(d) {
  const sessions = S.state?.tracks['life-demo']?.sessions || [];
  const mems = d.memories || [];
  const rows = sessions.map(s => ({ s, ms: mems.filter(m => (m.metadata || {}).session === s.id) }));
  const other = mems.filter(m => !sessions.some(s => s.id === (m.metadata || {}).session));
  return `
    <div class="panel-head"><div class="ph-title">原话 → 模型抽成事实（英文原样）→ 每条存成一个 1024 维向量 · 共 ${mems.length} 条</div></div>
    <div class="m0">
      ${rows.concat(other.length ? [{ s: null, ms: other }] : []).map(({ s, ms }) => `
        <div class="m0-row">
          <div class="m0-src">${s ? `<div class="d">${escHtml(fmtCardDate(s.date))}</div><div class="t">${rich(s.messages[0].content)}</div>` : '<div class="t dim">其他</div>'}</div>
          <div class="m0-arrow"><span>抽取</span>→</div>
          <div class="m0-out">${ms.map(m => `<div class="m0-mem"><span class="vec">向量</span>${rich(m.memory)}</div>`).join('') || '<div class="m0-mem dim">没有抽出事实</div>'}</div>
        </div>`).join('')}
    </div>`;
}

function renderGraphiti(d) {
  const edges = d.edges || [];
  return `
    <div class="panel-head">
      <div class="ph-title">${(d.nodes || []).length} 个实体 · ${edges.length} 条关系 · ${(d.episode_nodes || []).length} 段原话</div>
      <div class="kg-legend">
        <span><i class="lg-ep"></i>原话（一段会话）</span>
        <span><i class="lg-ment"></i>提到</span>
        <span><i class="lg-ent"></i>实体</span>
        <span><i class="lg-edge"></i>关系（悬停看原句和生效时间）</span>
      </div>
      <button class="ph-toggle" data-replay>▶ 重放建图过程</button>
    </div>
    <div class="graph-svg" id="s2-graph"></div>`;
}

/* ---- knowledge graph: model, layout, svg ---- */

const KG_COLORS = ['#c2410c', '#0f766e', '#7c3aed', '#b45309', '#be185d', '#1d4ed8', '#4d7c0f', '#0e7490', '#9f1239', '#57534e'];
const estW = (s, size, f = 0.58) => Array.from(String(s)).reduce((a, ch) => a + (/[⺀-鿿＀-￯]/.test(ch) ? size : size * f), 0);
const humanRel = s => String(s || '').toLowerCase().replace(/_/g, ' ');

function kgModel(data, opt = {}) {
  const nodes = (data.nodes || []).map(n => ({ id: n.uuid, name: n.name || '?', summary: n.summary || '', deg: 0 }));
  const idx = new Map(nodes.map((n, i) => [n.id, i]));
  const edges = (data.edges || []).filter(e => idx.has(e.source) && idx.has(e.target))
    .map(e => ({ ...e, s: idx.get(e.source), t: idx.get(e.target) }));
  for (const e of edges) { nodes[e.s].deg++; if (e.t !== e.s) nodes[e.t].deg++; }
  // connected components -> colours (largest first)
  const par = nodes.map((_, i) => i);
  const find = i => (par[i] === i ? i : (par[i] = find(par[i])));
  for (const e of edges) par[find(e.s)] = find(e.t);
  const groups = new Map();
  nodes.forEach((n, i) => { const r = find(i); groups.set(r, (groups.get(r) || 0) + 1); });
  const order = [...groups.entries()].sort((a, b) => b[1] - a[1] || a[0] - b[0]).map(x => x[0]);
  nodes.forEach((n, i) => { n.color = KG_COLORS[order.indexOf(find(i)) % KG_COLORS.length]; });
  let eps = [], ments = [];
  if (opt.episodes) {
    eps = (data.episode_nodes || []).slice().sort((a, b) => String(a.valid_at).localeCompare(String(b.valid_at)));
    const eIdx = new Map(eps.map((e, i) => [e.uuid, i]));
    ments = (data.mentions || []).filter(m => eIdx.has(m.source) && idx.has(m.target))
      .map(m => ({ ep: eIdx.get(m.source), n: idx.get(m.target) }));
  }
  // when each element first appears (episode order), for the build animation
  const epOrder = new Map(eps.map((e, i) => [e.uuid, i]));
  for (const e of edges) {
    const firsts = (e.episodes || []).map(u => epOrder.get(u)).filter(x => x != null);
    e.born = firsts.length ? Math.min(...firsts) : 0;
  }
  nodes.forEach((n, i) => {
    const ms = ments.filter(m => m.n === i).map(m => m.ep);
    const es = edges.filter(e => e.s === i || e.t === i).map(e => e.born);
    n.born = ms.length ? Math.min(...ms) : (es.length ? Math.min(...es) : 0);
  });
  return { nodes, edges, eps, ments };
}

function hashSeed(s) {
  let h = 2166136261;
  for (const ch of String(s)) { h ^= ch.codePointAt(0); h = Math.imul(h, 16777619); }
  return ((h >>> 0) % 10000) / 10000;
}

function kgLayout(m, W, H, opt = {}) {
  const N = m.nodes.length;
  const x0 = opt.episodes && m.eps.length ? 300 : 30;
  const epY = i => 50 + (i + 0.5) * ((H - 100) / Math.max(1, m.eps.length));
  const size = m.nodes.map(n => ({ w: estW(n.name, opt.font || 26) + 34, h: 2 * (12 + 3 * Math.min(n.deg, 5)) + 40 }));
  const pos = m.nodes.map((n, i) => {
    const ms = m.ments.filter(x => x.n === i);
    const y = ms.length ? ms.reduce((a, x) => a + epY(x.ep), 0) / ms.length : H * (0.2 + 0.6 * hashSeed(n.name + 'y'));
    return { x: x0 + 80 + (W - x0 - 160) * (0.15 + 0.7 * hashSeed(n.name)), y: y + (hashSeed(n.name + 'j') - 0.5) * 60 };
  });
  const area = (W - x0) * H;
  const k = Math.sqrt(area / Math.max(1, N)) * 0.55;
  const L = Math.min(260, Math.max(150, k * 0.9));
  for (let it = 0; it < 700; it++) {
    const cool = 1 - it / 700;
    const fx = pos.map(() => 0), fy = pos.map(() => 0);
    for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) {
      let dx = pos[i].x - pos[j].x, dy = pos[i].y - pos[j].y;
      const d2 = dx * dx + dy * dy || 1, d = Math.sqrt(d2);
      const f = (k * k) / d2 * 1.4;
      fx[i] += dx / d * f; fy[i] += dy / d * f; fx[j] -= dx / d * f; fy[j] -= dy / d * f;
    }
    for (const e of m.edges) {
      if (e.s === e.t) continue;
      const a = pos[e.s], b = pos[e.t];
      const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 1;
      const f = (d - L) * 0.06;
      fx[e.s] += dx / d * f; fy[e.s] += dy / d * f; fx[e.t] -= dx / d * f; fy[e.t] -= dy / d * f;
    }
    for (const mm of m.ments) {  // pull entities toward the row of the episode that mentions them
      fy[mm.n] += (epY(mm.ep) - pos[mm.n].y) * 0.012;
      fx[mm.n] += (x0 + 260 - pos[mm.n].x) * 0.002;
    }
    for (let i = 0; i < N; i++) {
      fx[i] += ((x0 + W) / 2 - pos[i].x) * 0.004;
      fy[i] += (H / 2 - pos[i].y) * 0.006;
      const step = 30 * cool + 1;
      const d = Math.hypot(fx[i], fy[i]) || 1;
      pos[i].x += fx[i] / d * Math.min(d, step);
      pos[i].y += fy[i] / d * Math.min(d, step);
    }
    // label-aware collision: boxes around node + name must not overlap
    for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) {
      const ox = (size[i].w + size[j].w) / 2 - Math.abs(pos[i].x - pos[j].x);
      const oy = (size[i].h + size[j].h) / 2 - Math.abs(pos[i].y - pos[j].y);
      if (ox > 0 && oy > 0) {
        if (ox / size[i].w < oy / size[i].h) {
          const s = pos[i].x < pos[j].x ? -1 : 1;
          pos[i].x += s * ox / 2; pos[j].x -= s * ox / 2;
        } else {
          const s = pos[i].y < pos[j].y ? -1 : 1;
          pos[i].y += s * oy / 2; pos[j].y -= s * oy / 2;
        }
      }
    }
    for (let i = 0; i < N; i++) {
      pos[i].x = Math.max(x0 + size[i].w / 2 + 10, Math.min(W - size[i].w / 2 - 10, pos[i].x));
      pos[i].y = Math.max(30, Math.min(H - 54, pos[i].y));
    }
  }
  // stretch to use the whole canvas (the force layout tends to bunch in the middle)
  if (N > 1) {
    const L0 = Math.min(...pos.map((p, i) => p.x - size[i].w / 2)), R0 = Math.max(...pos.map((p, i) => p.x + size[i].w / 2));
    const T0 = Math.min(...pos.map(p => p.y)), B0 = Math.max(...pos.map(p => p.y));
    const left = x0 + 30, right = W - 20, top = 40, bot = H - 60;
    for (let i = 0; i < N; i++) {
      const fx = R0 > L0 ? (pos[i].x - size[i].w / 2 - L0) / (R0 - L0 - size[i].w) || 0 : 0.5;
      pos[i].x = left + size[i].w / 2 + Math.max(0, Math.min(1, fx)) * (right - left - size[i].w);
      pos[i].y = B0 > T0 ? top + (pos[i].y - T0) / (B0 - T0) * (bot - top) : H / 2;
    }
  }
  return { pos, epY, x0, size };
}

function drawKG(host, data, opt = {}) {
  const W = opt.W || 1700, H = opt.H || 560;
  const font = opt.font || 26;
  const m = kgModel(data, { episodes: opt.episodes });
  if (!m.nodes.length) { host.innerHTML = '<div class="loading">图里还没有实体</div>'; return; }
  const { pos, epY, x0 } = kgLayout(m, W, H, { episodes: opt.episodes, font });
  const hit = new Map((opt.hits || []).map(h => [h.uuid, h.rank]));
  const fresh = opt.fresh || null;  // write page: what this session added or touched
  const isOn = e => hit.has(e.uuid) || !!(fresh && fresh.edges.has(e.uuid));
  const focus = hit.size > 0 || !!fresh;
  const hitNodes = new Set();
  for (const e of m.edges) if (isOn(e)) { hitNodes.add(e.s); hitNodes.add(e.t); }
  if (fresh) m.nodes.forEach((n, i) => { if (fresh.nodes.has(n.id)) hitNodes.add(i); });
  const STEP = 0.75;  // seconds per episode in the build animation
  const anim = (born, extra = 0) => opt.animate ? ` style="animation-delay:${(born * STEP + extra).toFixed(2)}s"` : '';
  const A = opt.animate ? ' kg-in' : '';
  const svg = [`<svg viewBox="0 0 ${W} ${H}" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" class="kg${focus ? ' focus' : ''}${focus && m.nodes.length > 14 ? ' dense' : ''}">`,
    `<defs><marker id="kg-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="context-stroke"/></marker></defs>`];
  const sessions = new Map((opt.sessions || []).map(s => [s.id, s]));
  // mentions
  if (m.eps.length) {
    for (const mm of m.ments) {
      const p = pos[mm.n], y = epY(mm.ep);
      svg.push(`<path class="kg-ment${A}" data-ep="${mm.ep}" data-n="${mm.n}"${anim(mm.ep, 0.15)} d="M${x0 - 40} ${y} C ${x0 + 40} ${y}, ${p.x - 120} ${p.y}, ${p.x} ${p.y}"/>`);
    }
  }
  // edges: quadratic curves, parallel edges fanned out
  const pairCount = new Map();
  const edgeSvg = [], labelSvg = [];
  // occupied boxes: node circles + their names (edge labels avoid these)
  const occ = m.nodes.map((n, i) => {
    const r = 12 + 3 * Math.min(n.deg, 5), p = pos[i], w = estW(n.name, font, 0.66) + 16;
    return { x1: Math.min(p.x - r, p.x - w / 2), x2: Math.max(p.x + r, p.x + w / 2), y1: p.y - r, y2: p.y + r + font + 10 };
  });
  for (const e of m.edges) {
    const key = e.s < e.t ? `${e.s}-${e.t}` : `${e.t}-${e.s}`;
    const nth = pairCount.get(key) || 0;
    pairCount.set(key, nth + 1);
    const a = pos[e.s], b = pos[e.t];
    const dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 1;
    const bend = (nth % 2 ? -1 : 1) * (28 + 46 * Math.ceil(nth / 2)) * (e.s < e.t ? 1 : -1);
    const cx = (a.x + b.x) / 2 - dy / d * bend, cy = (a.y + b.y) / 2 + dx / d * bend;
    const rT = 12 + 3 * Math.min(m.nodes[e.t].deg, 5) + 4;
    const ex = b.x - (b.x - cx) / (Math.hypot(b.x - cx, b.y - cy) || 1) * rT;
    const ey = b.y - (b.y - cy) / (Math.hypot(b.x - cx, b.y - cy) || 1) * rT;
    const label = humanRel(e.name);
    const lw = estW(label, 17, 0.56) + 14;
    let mx = 0, my = 0, best = Infinity;
    for (const t of [0.5, 0.4, 0.6, 0.3, 0.7, 0.22, 0.78]) {
      const px = (1 - t) * (1 - t) * a.x + 2 * t * (1 - t) * cx + t * t * b.x;
      const py = (1 - t) * (1 - t) * a.y + 2 * t * (1 - t) * cy + t * t * b.y;
      const box = { x1: px - lw / 2, x2: px + lw / 2, y1: py - 13, y2: py + 11 };
      let cost = Math.abs(t - 0.5) * 50;
      for (const o of occ) cost += Math.max(0, Math.min(box.x2, o.x2) - Math.max(box.x1, o.x1)) * Math.max(0, Math.min(box.y2, o.y2) - Math.max(box.y1, o.y1));
      if (cost < best) { best = cost; mx = px; my = py; }
    }
    occ.push({ x1: mx - lw / 2, x2: mx + lw / 2, y1: my - 13, y2: my + 11 });
    const col = m.nodes[e.s].color;
    const inv = !!e.invalid_at;
    const on = isOn(e);
    const cls = `kg-edge${inv ? ' inv' : ''}${on ? ' on' : ''}${A}`;
    edgeSvg.push(`<g class="${cls}" data-e="${escHtml(e.uuid)}"${anim(e.born, 0.45)}>
      <path class="hitbox" d="M${a.x} ${a.y} Q ${cx} ${cy} ${ex} ${ey}"/>
      <path class="line" d="M${a.x} ${a.y} Q ${cx} ${cy} ${ex} ${ey}" stroke="${inv ? '#a8a29e' : col}" marker-end="url(#kg-arrow)"/></g>`);
    if (hit.has(e.uuid)) {
      labelSvg.push(`<g class="kg-rank${A}"${anim(e.born, 0.5)}><circle cx="${mx}" cy="${my}" r="19" fill="${col}"/><text x="${mx}" y="${my + 7}" text-anchor="middle" font-size="21" font-weight="800" fill="#fff">${hit.get(e.uuid)}</text></g>`);
    } else if (on || !focus || opt.labelsAll) {
      labelSvg.push(`<g class="kg-elabel${inv ? ' inv' : ''}${on ? ' on' : ''}${A}" data-e="${escHtml(e.uuid)}"${anim(e.born, 0.55)}><rect x="${mx - lw / 2}" y="${my - 13}" width="${lw}" height="24" rx="12"/><text x="${mx}" y="${my + 5}" text-anchor="middle">${escHtml(label)}${inv ? ' ✕' : ''}</text></g>`);
    }
  }
  svg.push(...edgeSvg);
  // episodes column
  m.eps.forEach((ep, i) => {
    const y = epY(i);
    const s = sessions.get(ep.name);
    const date = fmtCardDate(s?.date || ep.valid_at || '').slice(0, 5);
    const text = s ? String(s.messages[0].content).replace(/^\[[^\]]*\]\s*/, '') : ep.name;
    let t = text;
    if (estW(t, 21) > x0 - 80) { while (t && estW(t + '…', 21) > x0 - 80) t = t.slice(0, -1); t += '…'; }
    svg.push(`<g class="kg-ep${A}" data-ep="${i}"${anim(i)}><rect x="8" y="${y - 30}" width="${x0 - 48}" height="60" rx="10"/>
      <text x="22" y="${y - 6}" class="d">${escHtml(date)}</text><text x="22" y="${y + 20}" class="t">${escHtml(t)}</text></g>`);
  });
  // nodes
  const nameSvg = [];
  m.nodes.forEach((n, i) => {
    const r = 12 + 3 * Math.min(n.deg, 5);
    const p = pos[i];
    const on = hitNodes.has(i);
    svg.push(`<g class="kg-node${on ? ' on' : ''}${A}" data-n="${i}"${anim(n.born, 0.3)}>
      <circle cx="${p.x}" cy="${p.y}" r="${r}" fill="${n.color}"/></g>`);
    nameSvg.push(`<g class="kg-node kg-name${on ? ' on' : ''}${A}" data-n="${i}"${anim(n.born, 0.3)}><text x="${p.x}" y="${p.y + r + font + 2}" text-anchor="middle" font-size="${font}">${escHtml(n.name)}</text></g>`);
  });
  svg.push(...labelSvg, ...nameSvg);
  svg.push('</svg>');
  host.innerHTML = svg.join('');
  bindKG(host, m);
}

function hideTip() { const t = document.getElementById('s2-tip'); if (t) t.style.display = 'none'; }
function tipEl() {
  let tip = document.getElementById('s2-tip');
  if (!tip) { tip = document.createElement('div'); tip.id = 's2-tip'; document.body.appendChild(tip); }
  return tip;
}

function bindKG(host, m) {
  const svg = $('svg', host);
  const tip = tipEl();
  const move = ev => {
    tip.style.left = Math.min(innerWidth - tip.offsetWidth - 20, ev.clientX + 16) + 'px';
    tip.style.top = Math.min(innerHeight - tip.offsetHeight - 12, ev.clientY + 16) + 'px';
  };
  const edgeTip = e => `${escHtml(e.fact || '')}<span class="tv">${escHtml(humanRel(e.name))} · 生效 ${escHtml(String(e.valid_at || '?').slice(0, 10))}${e.invalid_at ? ' · 失效 ' + escHtml(String(e.invalid_at).slice(0, 10)) : ''}</span>`;
  const clear = () => { svg.classList.remove('hover'); $$('.hl', svg).forEach(x => x.classList.remove('hl')); tip.style.display = 'none'; };
  $$('.kg-edge, .kg-elabel', svg).forEach(g => {
    const e = m.edges.find(x => x.uuid === g.dataset.e);
    if (!e) return;
    g.addEventListener('mouseenter', ev => {
      svg.classList.add('hover');
      $$(`[data-e="${CSS.escape(e.uuid)}"]`, svg).forEach(x => x.classList.add('hl'));
      $$(`.kg-node[data-n="${e.s}"], .kg-node[data-n="${e.t}"]`, svg).forEach(x => x.classList.add('hl'));
      tip.innerHTML = edgeTip(e); tip.style.display = 'block'; move(ev);
    });
    g.addEventListener('mousemove', move);
    g.addEventListener('mouseleave', clear);
  });
  $$('.kg-node', svg).forEach(g => {
    const i = Number(g.dataset.n), n = m.nodes[i];
    g.addEventListener('mouseenter', ev => {
      svg.classList.add('hover');
      $$(`.kg-node[data-n="${i}"]`, svg).forEach(x => x.classList.add('hl'));
      for (const e of m.edges) if (e.s === i || e.t === i) {
        $$(`[data-e="${CSS.escape(e.uuid)}"]`, svg).forEach(x => x.classList.add('hl'));
        $$(`.kg-node[data-n="${e.s}"], .kg-node[data-n="${e.t}"]`, svg).forEach(x => x.classList.add('hl'));
      }
      $$(`.kg-ment[data-n="${i}"]`, svg).forEach(x => { x.classList.add('hl'); $$(`.kg-ep[data-ep="${x.dataset.ep}"]`, svg).forEach(y => y.classList.add('hl')); });
      tip.innerHTML = `<b>${escHtml(n.name)}</b><br>${escHtml(n.summary)}`; tip.style.display = 'block'; move(ev);
    });
    g.addEventListener('mousemove', move);
    g.addEventListener('mouseleave', clear);
  });
  $$('.kg-ep', svg).forEach(g => {
    g.addEventListener('mouseenter', () => {
      svg.classList.add('hover');
      g.classList.add('hl');
      $$(`.kg-ment[data-ep="${g.dataset.ep}"]`, svg).forEach(x => { x.classList.add('hl'); $$(`.kg-node[data-n="${x.dataset.n}"]`, svg).forEach(y => y.classList.add('hl')); });
    });
    g.addEventListener('mouseleave', clear);
  });
}

/* ---------------- 3 / 5 · 提问：每个系统是怎么找的 ---------------- */

const HOW = {
  control:  { label: '不检索' },
  hermes:   { label: '文件整份 + Agent 自己搜' },
  mem0:     { label: '问题变向量，给每条打分' },
  graphiti: { label: '关键词 + 向量两路，再融合' },
};

function askCfg(n) {
  if (n === 3) return { n, track: 'life-demo', time: '2026-11-08 10:00', cols: $('#s3-cols'), input: $('#s3-input'), btn: $('#s3-btn') };
  return { n, track: 'night-run-live', time: '2026-11-02 23:30', cols: $('#s5-cols'), input: $('#s5-input'), btn: $('#s5-btn') };
}

function setupCols(n) {
  const cfg = askCfg(n);
  cfg.cols.classList.add('askbody');
  cfg.cols.innerHTML = `<div class="sumrow">${BACKENDS.map(b => `
      <div class="sum${b.key === S.ask[n].sel ? ' sel' : ''}" data-b="${b.key}">
        <div class="sum-h"><span class="sum-name">${escHtml(b.name)}</span><span class="sum-how">${escHtml(HOW[b.key].label)}</span></div>
        <div class="sum-st" data-st></div>
        <div class="sum-ans" data-ans><span class="dim">还没问</span></div>
      </div>`).join('')}</div>
    <div class="detail" data-detail></div>`;
  cfg.cols.addEventListener('click', e => {
    const card = e.target.closest('.sum');
    if (card) selectCol(n, card.dataset.b);
  });
  cfg.btn.addEventListener('click', () => runAsk(n));
  cfg.input.addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); runAsk(n); }
  });
  renderDetail(n);
}

function selectCol(n, key) {
  S.ask[n].sel = key;
  $$('.sum', askCfg(n).cols).forEach(c => c.classList.toggle('sel', c.dataset.b === key));
  hideTip();
  renderDetail(n);
}

function cycleCol(n, d) {
  const keys = BACKENDS.map(b => b.key);
  const i = keys.indexOf(S.ask[n].sel);
  selectCol(n, keys[(i + d + keys.length) % keys.length]);
}

function enterAsk(n) {
  if (!S.ask[n]) {
    S.ask[n] = { running: false, done: false, started: false, sel: 'hermes', res: {} };
    setupCols(n);
  }
  getState().then(() => {
    if (AUTO && !S.ask[n].started) runAsk(n);
    else window.__liveReady = true;
  }).catch(() => { window.__liveReady = true; });
}

async function runAsk(n) {
  const cfg = askCfg(n);
  const st = S.ask[n];
  if (!st || st.running) return;
  const text = cfg.input.value.trim();
  if (!text) return;
  if (!S.state) {
    try { await getState(); } catch (e) { /* 高亮会缺失，但仍可提问 */ }
  }
  st.running = true;
  st.started = true;
  st.res = {};
  if (S.cost) S.cost[n] = {};  // the read-cost page shows this question only
  cfg.btn.disabled = true;
  const prompt = `[系统时间] ${cfg.time}\n${text}`;
  st.probe = probeFor(cfg.track, prompt);
  st.prompt = text;
  renderDetail(n);
  await Promise.allSettled(BACKENDS.map(b => runColumn(n, cfg, b, prompt)));
  st.running = false;
  st.done = true;
  cfg.btn.disabled = false;
  window.__liveReady = true;
}

const timerHtml = t0 => `<span class="timer" data-t0="${t0}">0.0 s</span>`;

function sumEl(n, key) { return askCfg(n).cols.querySelector(`.sum[data-b="${key}"]`); }

function paintSum(n, key) {
  const r = S.ask[n].res[key] || {};
  const el = sumEl(n, key);
  if (!el) return;
  const stEl = $('[data-st]', el), ansEl = $('[data-ans]', el);
  const bits = [];
  if (r.error) bits.push(`<span class="err">${escHtml(r.error)}</span>`);
  else if (!r.read) bits.push(`<span class="ph">读取中</span> ${timerHtml(r.t0)}`);
  else {
    const hits = r.read.read.hits || [];
    if (key === 'hermes') bits.push(`文件 ${hits.length} 条常驻`);
    else if (key !== 'control') bits.push(`${fmtMs(r.read.read.latency_ms)} · 取回 ${hits.length} 条`);
    if (!r.answer) bits.push(`<span class="ph">作答中</span> ${timerHtml(r.t1)}`);
    else {
      const calls = (r.answer.action.tool_calls || []).filter(t => t.name === 'session_search').length;
      if (key === 'hermes') bits.push(calls ? `搜了 ${calls} 次` : '没有搜');
      bits.push(`上下文 <b>${r.answer.inject?.chars ?? 0}</b> 字`);
      bits.push(`作答 ${fmtMs(r.answer.action.latency_ms)}`);
    }
  }
  stEl.innerHTML = bits.join(' · ');
  const a = r.answer?.action;
  const ev = S.ask[n].probe?.evidence_any || [];
  ansEl.innerHTML = a ? (n === 5 ? richSentences(a.answer || '', ev) : rich(a.answer || '', { ev })) : (r.t0 ? '' : '<span class="dim">还没问</span>');
}

async function runColumn(n, cfg, b, prompt) {
  const st = S.ask[n];
  const r = st.res[b.key] = { t0: Date.now() };
  paintSum(n, b.key);
  try {
    if (b.key === 'control') {
      r.read = { read: { latency_ms: 0, hits: [] } };
    } else {
      r.read = MOCK_ON ? await mockRead(cfg.track, b) : await api('/api/live/read', { track: cfg.track, backend: b.key, prompt });
    }
  } catch (err) {
    r.error = '读取失败：' + err.message;
    paintSum(n, b.key); if (st.sel === b.key) renderDetail(n);
    return;
  }
  r.t1 = Date.now();
  paintSum(n, b.key); if (st.sel === b.key) renderDetail(n);
  try {
    const a = MOCK_ON ? await mockAnswer(cfg.track, b) : await api('/api/live/answer', { track: cfg.track, backend: b.key, prompt, hits: r.read.read.hits || [] });
    if (a.action?.error) throw new Error(a.action.error);
    r.answer = a;
    S.cost = S.cost || {};
    S.cost[n] = S.cost[n] || {};
    S.cost[n][b.key] = { prompt, read_ms: b.key === 'control' ? null : r.read.read.latency_ms,
      hits: (r.read.read.hits || []).length, chars: a.inject?.chars ?? 0,
      searches: (a.action.tool_calls || []).filter(t => t.name === 'session_search').length,
      llm_calls: a.action.llm_calls || 0, tokens: a.action.tokens || 0, ans_ms: a.action.latency_ms || 0 };
    if (S.screen === 'rc') enterReadCost();
  } catch (err) {
    r.error = '作答失败：' + err.message;
  }
  paintSum(n, b.key);
  if (st.sel === b.key) renderDetail(n);
}

/* ---- the detail pane: how the selected system found its memories ---- */

function stepHtml(num, title, body, cls = '') {
  return `<div class="step ${cls}"><div class="st-h"><span class="st-n">${num}</span>${title}</div><div class="st-b">${body}</div></div>`;
}
const ARROW = '<div class="st-arrow">→</div>';
const waitHtml = (label, t0) => `<div class="wait"><span class="ph">${label}</span> ${t0 ? timerHtml(t0) : ''}</div>`;

function answerStep(num, r, n, opt = {}) {
  const ev = S.ask[n].probe?.evidence_any || [];
  let body;
  if (r.error) body = `<div class="err">${escHtml(r.error)}</div>`;
  else if (!r.answer) body = waitHtml('作答中', r.t1);
  else {
    const a = r.answer.action;
    const tools = (a.tool_calls || []).filter(t => t.name !== 'session_search');
    body = (tools.length ? `<div class="tools">${tools.map(t => `<span class="tool">调用了 ${escHtml(t.name)}</span>`).join('')}</div>` : '') +
      `<div class="ans-text">${n === 5 ? richSentences(a.answer || '', ev) : rich(a.answer || '', { ev })}</div>
       <div class="ans-meta">放进上下文 <b>${r.answer.inject?.chars ?? 0}</b> 字 · 作答 ${fmtMs(a.latency_ms)}</div>`;
  }
  return stepHtml(num, opt.title || '模型拿着这些回答', body, 'answer-step');
}

function renderDetail(n) {
  const st = S.ask[n];
  const el = $('[data-detail]', askCfg(n).cols);
  if (!el) return;
  const key = st.sel;
  const b = byKey(key);
  const r = st.res[key];
  const head = `<div class="dt-h"><b>${escHtml(b.name)}</b> 是怎么找的<span class="dt-sub">${escHtml(HOW[key].label)}</span><span class="dt-keys">↑↓ 切换系统</span></div>`;
  if (!r) {
    el.innerHTML = head + `<div class="dt-empty">点“问”，四个系统同时去找；这里一步步展开 ${escHtml(b.name)} 的过程</div>`;
    return;
  }
  let body;
  if (key === 'control') body = detailControl(r, n);
  else if (key === 'hermes') body = detailHermes(r, n);
  else if (key === 'mem0') body = detailMem0(r, n);
  else body = detailGraphiti(r, n);
  el.innerHTML = head + `<div class="steps ${key}">${body}</div>`;
  if (key === 'graphiti' && r.read?.read?.graph) {
    const host = $('[data-kg]', el);
    const tr = r.read.read.trace || {};
    const hits = (tr.rrf || []).map((x, i) => ({ uuid: x.uuid, rank: i + 1 }));
    if (host) drawKG(host, r.read.read.graph, { W: 640, H: 620, hits, font: 30 });
  }
}

function detailControl(r, n) {
  return stepHtml(1, '不检索', '<div class="big-note">系统提示里没有任何记忆<br>模型只能凭问题本身回答</div>') + ARROW + answerStep(2, r, n);
}

function detailHermes(r, n) {
  if (r.error && !r.read) return `<div class="err">${escHtml(r.error)}</div>`;
  const ev = S.ask[n].probe?.evidence_any || [];
  const hits = r.read?.read?.hits || [];
  const files = hits.map(h => {
    const m = String(h.text).match(/^\[([^\]]+)\]\s*(.*)$/s);
    return { tag: m ? m[1] : '', text: m ? m[2] : h.text };
  });
  const s1 = stepHtml(1, '会话开始：两份文件整份放进提示', !r.read ? waitHtml('读取中', r.t0) :
    `<div class="hm-files">${files.map(f => `<div class="hf" data-pop="${popId(`Hermes · ${escHtml(f.tag)}`, `<div class="pop-txt">${rich(f.text, { ev, rule: n === 5 ? RULE_SRC : '' })}</div>`)}"><span class="hf-tag">${escHtml(f.tag)}</span>${rich(f.text, { ev, rule: n === 5 ? RULE_SRC : '' })}</div>`).join('') || '<div class="dim">两份文件都是空的</div>'}</div>
     <div class="st-foot">${files.length} 条 · 不检索，原样全放</div>`, 'files-step');
  let s2;
  if (!r.answer) s2 = waitHtml(r.read ? 'Agent 读题，决定要不要搜' : '等待', r.t1);
  else {
    const calls = (r.answer.action.tool_calls || []).filter(t => t.name === 'session_search');
    s2 = calls.length ? calls.map((c, i) => searchCallHtml(c, i, ev, n)).join('') :
      '<div class="big-note">Agent 觉得文件里的内容够用，<br>没有调用 session_search</div>';
  }
  return s1 + ARROW + stepHtml(2, 'Agent 自己决定搜什么：<code>session_search</code>', s2, 'search-step') + ARROW + answerStep(3, r, n);
}

const ROUTE_TEXT = {
  trigram: '中文词都 ≥3 字 → trigram 全文索引',
  like: '有中文词不到 3 字 → 逐词子串匹配（LIKE）',
  fts5: '英文 → FTS5 全文索引',
  'fts5 · any-term': '英文 → FTS5，全部命中失败后改为任一词',
  empty: '查询为空',
};

function searchCallHtml(c, i, ev, n) {
  const d = c.details || {};
  const sessions = d.sessions || [];
  const dates = sessionDates();
  return `<div class="call">
    <div class="call-q"><span class="call-i">第 ${i + 1} 次</span>query = <code>${escHtml(c.args?.query ?? '')}</code></div>
    <div class="call-route">${escHtml(ROUTE_TEXT[d.route] || d.route || '')}${d.match ? ` · <code>${escHtml(d.match)}</code>` : ''}${d.ms != null ? ` · ${d.ms} ms` : ''}</div>
    <div class="call-res">${sessions.length ? sessions.map(s => `
      <div class="sess"><div class="sess-h">${escHtml(s.session_id)} <span>${escHtml(fmtCardDate(dates[s.session_id] || ''))}</span>${s.hydrated ? '<em>整段返回</em>' : ''}</div>
      ${s.messages.map(m => `<div class="sm${m.hit ? ' hit' : ''}"><b>${m.role === 'user' ? '用户' : '助手'}</b>${rich(String(m.content).replace(/^\[[^\]]*\]\s*/, ''), { ev, rule: n === 5 ? RULE_SRC : '' })}</div>`).join('')}</div>`).join('')
      : '<div class="dim">0 条</div>'}</div>
  </div>`;
}

function scoreBar(v, max = 1) {
  const w = Math.max(0, Math.min(1, (v || 0) / max)) * 100;
  return `<span class="sb"><i style="width:${w}%"></i></span><span class="sv">${(v || 0).toFixed(2)}</span>`;
}

function detailMem0(r, n) {
  const ev = S.ask[n].probe?.evidence_any || [];
  if (!r.read) return r.error ? `<div class="err">${escHtml(r.error)}</div>` : waitHtml('检索中', r.t0);
  const tr = r.read.read.trace || {};
  const all = tr.all || [];
  const k = tr.k || 5;
  const sem = all.map(x => x.details?.semantic_score || 0);
  const anyKw = all.some(x => (x.details?.bm25_score || 0) > 0 || (x.details?.entity_boost || 0) > 0);
  const s1 = stepHtml(1, '把问题变成向量', `
    <div class="q-card">${escHtml(S.ask[n].prompt || '')}</div>
    <div class="flow-down">↓ text-embedding-v4</div>
    <div class="vec-card">1024 维向量</div>
    <div class="st-foot">另两路同时算：BM25 关键词、实体匹配</div>
    ${anyKw ? '' : '<div class="note">这次关键词和实体两路都是 0：Mem0 开源版用英文分词和实体模型（spaCy），中文问题对不上，只剩语义一路在起作用</div>'}`, 'q-step');
  const rows = all.map((x, i) => {
    const d = x.details || {};
    const inCtx = i < k;
    const txt = rich(x.memory || '', { ev });
    return `${i === k ? `<div class="cut">↑ 前 ${k} 条放进上下文 · 下面的不放</div>` : ''}
      <div class="m-row${inCtx ? ' in' : ''}" data-pop="${popId(`Mem0 · 第 ${i + 1} 名 · ${inCtx ? '放进上下文' : '没放进上下文'}`,
        `<div class="pop-txt">${txt}</div>
        <div class="pop-kv"><span>语义</span><b>${(d.semantic_score || 0).toFixed(3)}</b><span>关键词</span><b>${(d.bm25_score || 0).toFixed(3)}</b><span>实体</span><b>${(d.entity_boost || 0).toFixed(3)}</b><span>总分</span><b>${(x.score || 0).toFixed(3)}</b></div>`)}">
        <span class="m-rank">${i + 1}</span>
        <span class="m-txt">${txt}</span>
        <span class="m-sc"><em>语义</em>${scoreBar(d.semantic_score)}</span>
        <span class="m-sc"><em>关键词</em>${scoreBar(d.bm25_score)}</span>
        <span class="m-sc"><em>实体</em>${scoreBar(d.entity_boost)}</span>
        <span class="m-final">${(x.score || 0).toFixed(3)}</span>
      </div>`;
  }).join('');
  const s2 = stepHtml(2, `给库里每条记忆打分，按总分排序，取前 ${k}`, `<div class="m-table">${rows || '<div class="dim">库里没有记忆</div>'}</div>
    <div class="st-foot">参与排序 ${all.length} 条（相似度低于阈值 ${all[0]?.details?.threshold ?? 0.1} 的直接丢掉）· 检索 ${fmtMs(r.read.read.latency_ms)}</div>`, 'score-step');
  return s1 + ARROW + s2 + ARROW + answerStep(3, r, n);
}

function detailGraphiti(r, n) {
  const ev = S.ask[n].probe?.evidence_any || [];
  if (!r.read) return r.error ? `<div class="err">${escHtml(r.error)}</div>` : waitHtml('检索中', r.t0);
  const tr = r.read.read.trace || {};
  const facts = tr.facts || {};
  const cos = tr.cosine_scores || {};
  const ftq = String(tr.fulltext_query || '').replace(/^\(@group_id:[^)]*\)\s*/, '');
  const g = r.read.read.graph || { nodes: [], edges: [] };
  const nodeName = Object.fromEntries((g.nodes || []).map(x => [x.uuid, x.name]));
  const edgeOf = Object.fromEntries((g.edges || []).map(x => [x.uuid, x]));
  const day = v => v ? String(v).slice(0, 10) : '';
  const factPop = (u, title, extra = '') => {
    const f = facts[u] || {}, e = edgeOf[u] || {};
    const win = `${day(e.valid_at) || '?'} → ${day(e.invalid_at) || '现在'}`;
    return popId(`Graphiti · ${title}`, `<div class="pop-txt">${rich(f.fact || '', { ev })}</div>
      <div class="pop-rel"><b>${escHtml(nodeName[f.source] || '?')}</b> —<code>${escHtml(f.name || '')}</code>→ <b>${escHtml(nodeName[f.target] || '?')}</b></div>
      <div class="pop-kv"><span>生效</span><b>${escHtml(win)}</b>${extra}</div>`);
  };
  const list = (ids, withScore) => ids.slice(0, 6).map((u, i) => `<div class="g-c" data-pop="${factPop(u, `${withScore ? '向量' : '关键词'}第 ${i + 1} 名`, withScore && cos[u] != null ? `<span>余弦相似度</span><b>${cos[u].toFixed(3)}</b>` : '')}"><span class="r">${i + 1}</span><span class="x">${rich(trunc(facts[u]?.fact, 40), { ev })}</span>${withScore && cos[u] != null ? `<span class="g-s">${scoreBar(cos[u])}</span>` : ''}</div>`).join('');
  const bm = tr.bm25 || [], cs = tr.cosine || [];
  const s1 = stepHtml(1, '两路分别找关系边', `
    <div class="way"><div class="way-h">关键词（BM25）<span>${bm.length} 条</span></div>
      <div class="way-q">实际查询 <code>${escHtml(ftq)}</code></div>
      ${bm.length ? list(bm, false) : '<div class="note">0 条：整句中文没有空格，被当成一个词，和任何关系原句都对不上</div>'}</div>
    <div class="way"><div class="way-h">向量（余弦相似度）<span>${cs.length} 条</span></div>${list(cs, true)}</div>`, 'ways-step');
  const rrf = tr.rrf || [];
  const rank = (arr, u) => { const i = arr.indexOf(u); return i < 0 ? '—' : `#${i + 1}`; };
  const fused = rrf.map((x, i) => {
    const h = (r.read.read.hits || [])[i];
    const win = h?.details ? `${String(h.details.valid_at || '?').slice(5, 10)} → ${h.details.invalid_at ? String(h.details.invalid_at).slice(5, 10) : '现在'}` : '';
    return `<div class="f-row" data-pop="${factPop(x.uuid, `融合后第 ${i + 1} 名`, `<span>关键词</span><b>${rank(bm, x.uuid)}</b><span>向量</span><b>${rank(cs, x.uuid)}</b><span>RRF</span><b>${x.score}</b>`)}"><span class="r on">${i + 1}</span><span class="x">${rich(facts[x.uuid]?.fact || '', { ev, rule: n === 5 ? RULE_SRC : '' })}</span>
      <span class="f-meta">${win ? `<b>${escHtml(win)}</b> · ` : ''}关键词 ${rank(bm, x.uuid)} · 向量 ${rank(cs, x.uuid)} · RRF ${x.score}</span></div>`;
  }).join('');
  const s2 = stepHtml(2, `RRF 融合，取前 ${rrf.length} 条边：在图里的位置`, `
    <div class="g-row"><div class="kg-mini" data-kg></div>
    <div class="fused">${fused || '<div class="dim">0 条</div>'}</div></div>
    <div class="st-foot">RRF：每条边按它在两路里的名次打分（1/名次）相加 · 检索 ${fmtMs(r.read.read.latency_ms)} · 边上带生效时间，一起放进上下文</div>`, 'graph-step');
  return s1 + ARROW + s2 + ARROW + answerStep(3, r, n);
}

/* ---------------- 4 · 写入 ---------------- */
/* Same shape as 3/5: a summary card per system on top, and below it the
   selected system's write process for the selected session, step by step. */

const S4 = () => S.s4;
const WHOW = {
  hermes: '原话进库 + 模型改两份文件',
  mem0: '模型抽事实，只增不改',
  graphiti: '抽实体和关系，合并进图',
};
const HFILE = { memory: 'MEMORY.md', user: 'USER.md' };

async function enter4() {
  window.__liveReady = false;
  try {
    const st = await getState();
    const tr = st.tracks['night-run-live'];
    if (!S.s4) {
      S.s4 = {
        sessions: tr.sessions,
        written: Object.fromEntries(B4.map(b => [b.key, (tr.status?.[b.key]?.written) || []])),
        insp: {}, snap: Object.fromEntries(B4.map(b => [b.key, {}])),
        res: Object.fromEntries(B4.map(b => [b.key, {}])), err: {},
        running: false, busy: {}, sel: 'hermes', ss: null,
      };
      $('#s4-stamp').textContent = tr.stamp ? `库建立于 ${fmtStamp(tr.stamp)}` : '';
      setupWrite();
      renderSessions();
      await loadInitial4();
    }
    setButtons();
    window.__liveReady = !S.stepMode;
  } catch (err) {
    $('#s4-cols').innerHTML = `<div class="loading">读取失败：${escHtml(err.message)}</div>`;
    window.__liveReady = true;
  }
}

const sIdx = sid => S4().sessions.findIndex(s => s.id === sid);
function curSess() {  // the clicked session, else the selected system's latest one
  const s4 = S4();
  if (s4.ss) return s4.ss;
  const k = s4.sel;
  let best = -1;
  for (const sid of s4.written[k] || []) best = Math.max(best, sIdx(sid));
  if (s4.busy[k]) best = Math.max(best, s4.busy[k].n - 1);
  return s4.sessions[Math.max(0, best)].id;
}

function renderSessions() {
  const s4 = S4();
  const lesson = '二十分钟';
  const cur = curSess();
  $('#s4-sessions').innerHTML = `<div class="s-head">夜间实验 · ${s4.sessions.length} 段对话</div>` + s4.sessions.map((s, i) => {
    const firstUser = s.messages.find(m => m.role === 'user') || s.messages[0];
    const lessonMsg = s.messages.find(m => String(m.content).includes(lesson));
    const n = B4.filter(b => (s4.written[b.key] || []).includes(s.id)).length;
    const live = Object.values(s4.busy).some(x => x.n === i + 1);
    const mark = n === B4.length ? '<span class="badge done">已写入</span>'
      : live ? '<span class="badge live">写入中</span>'
      : n ? `<span class="badge">${n}/${B4.length}</span>` : '';
    const open = s.id === cur;
    return `<div class="s-card${open ? ' sel' : ''}${n || live ? '' : ' pending'}" data-sid="${s.id}">
      <div class="d"><span>${escHtml(fmtCardDate(s.date))}</span>${lessonMsg ? '<span class="badge">教训</span>' : ''}${mark}</div>
      <div class="t">${lessonMsg ? lessonHtml(lessonMsg.content, lesson) : rich(String(firstUser.content))}</div>
    </div>`;
  }).join('');
  $$('#s4-sessions .s-card').forEach(el => el.addEventListener('click', () => {
    s4.ss = el.dataset.sid;
    renderSessions();
    renderWriteDetail();
    openSession(s4.sessions.findIndex(x => x.id === el.dataset.sid));
  }));
}

function openSession(i) {
  const s = S4().sessions[i];
  if (!s) return;
  const lesson = '二十分钟';
  openPop(`第 ${i + 1} 段对话 · <span class="dim">${escHtml(fmtCardDate(s.date))}</span>`,
    s.messages.map(m => `<div class="pop-msg ${m.role}"><b>${m.role === 'user' ? '用户' : '助手'}</b><div>${String(m.content).includes(lesson) ? lessonHtml(m.content, lesson) : rich(String(m.content))}</div></div>`).join(''));
}

function lessonHtml(text, word) {
  const chunks = String(text).match(/[^。！？!?]+[。！？!?]?/g) || [String(text)];
  return chunks.map(c => c.includes(word) ? `<span class="lesson">${rich(c)}</span>` : rich(c)).join('');
}

function setupWrite() {
  const el = $('#s4-cols');
  el.innerHTML = `<div class="sumrow">${B4.map(b => `
      <div class="sum wsum${b.key === S4().sel ? ' sel' : ''}" data-b="${b.key}">
        <div class="sum-h"><span class="sum-name">${escHtml(b.name)}</span><span class="sum-how">${escHtml(WHOW[b.key])}</span></div>
        <div class="sum-st" data-st></div>
        <div class="w-tot" data-tot></div>
      </div>`).join('')}</div>
    <div class="detail" data-detail></div>`;
  el.addEventListener('click', e => {
    const c = e.target.closest('.sum');
    if (c) selectW(c.dataset.b);
  });
  B4.forEach(b => paintWSum(b.key));
  renderWriteDetail();
}

function selectW(key) {
  S4().sel = key;
  $$('#s4-cols .sum').forEach(c => c.classList.toggle('sel', c.dataset.b === key));
  hideTip();
  renderSessions();
  renderWriteDetail();
}
function cycleW(d) {
  const keys = B4.map(b => b.key);
  selectW(keys[(keys.indexOf(S4().sel) + d + keys.length) % keys.length]);
}

async function loadInitial4() {
  const s4 = S4();
  const results = await Promise.allSettled(B4.map(b => getInspect('night-run-live', b.key)));
  results.forEach((r, i) => { if (r.status === 'fulfilled') s4.insp[B4[i].key] = r.value; });
  s4.loaded = true;
  B4.forEach(b => paintWSum(b.key));
  renderWriteDetail();
}

function lessonStored(key) {
  const insp = S4().insp[key];
  if (!insp) return false;
  const probe = S.state?.tracks['night-run-live']?.probes?.find(p => p.id === 'D2');
  const all = JSON.stringify(insp).toLowerCase();
  return (probe?.evidence_any || []).some(t => all.includes(String(t).toLowerCase()));
}

function totalsHtml(key, insp) {
  if (!insp) return '<span class="dim">读取中…</span>';
  if (key === 'hermes') {
    const f = insp.files || {};
    const used = Object.values(f).reduce((a, v) => a + (v.used || 0), 0);
    return `state.db <b>${(insp.rows || []).length}</b> 行 · 文件 <b>${used}</b> 字`;
  }
  if (key === 'mem0') return `库里 <b>${(insp.memories || []).length}</b> 条记忆`;
  return `<b>${(insp.nodes || []).length}</b> 个实体 · <b>${(insp.edges || []).length}</b> 条关系`;
}

function paintWSum(key) {
  const s4 = S4();
  const el = $(`#s4-cols .sum[data-b="${key}"]`);
  if (!el) return;
  const busy = s4.busy[key];
  const done = s4.written[key] || [];
  let st;
  if (busy) st = `<span class="ph">第 ${busy.n} 段 · 写入中</span> ${timerHtml(busy.t0)}`;
  else if (s4.err[key]) st = `<span class="err">${escHtml(s4.err[key])}</span>`;
  else if (!done.length) st = '<span class="dim">还没有写入</span>';
  else {
    const last = done[done.length - 1], r = s4.res[key][last];
    st = `已写 ${done.length} 段` + (r ? ` · 第 ${sIdx(last) + 1} 段用时 <b>${fmtSec(r.ms)}</b> 秒 · ${callsTxt(r.stats)}` : '');
  }
  $('[data-st]', el).innerHTML = st;
  $('[data-tot]', el).innerHTML = totalsHtml(key, s4.insp[key]) +
    (done.length ? (lessonStored(key) ? ' · <span class="lamp-on">教训已存下 ✓</span>' : ' · <span class="dim">教训还没有</span>') : '');
}

function renderWriteDetail() {
  const s4 = S4();
  const el = $('#s4-cols [data-detail]');
  if (!el) return;
  const key = s4.sel, b = byKey(key), sid = curSess(), i = sIdx(sid);
  const head = `<div class="dt-h"><b>${escHtml(b.name)}</b> 怎么写第 ${i + 1} 段<span class="dt-sub">${escHtml(fmtCardDate(s4.sessions[i].date))} · ${escHtml(WHOW[key])}</span><span class="dt-keys">点左边换一段 · ↑↓ 切换系统</span></div>`;
  const busy = s4.busy[key];
  const written = (s4.written[key] || []).includes(sid);
  let body;
  if (busy && busy.n === i + 1) body = `<div class="dt-empty"><span class="ph">写入中</span> ${timerHtml(busy.t0)}</div>`;
  else if (!written) body = `<div class="dt-empty">这一段还没写进 ${escHtml(b.name)}：点“写入下一段”</div>`;
  else {
    const snap = s4.snap[key][sid] || s4.insp[key];
    if (!snap) body = '<div class="dt-empty">读取中…</div>';
    else body = `<div class="steps w-${key}">${key === 'hermes' ? wHermes(sid, i, snap) : key === 'mem0' ? wMem0(sid, i, snap) : wGraphiti(sid, i, snap)}</div>`;
  }
  el.innerHTML = head + body;
  if (key === 'graphiti' && written && !(busy && busy.n === i + 1)) drawWriteGraph(el, sid, i);
}

const callsTxt = st => `${st.llm_calls} 次模型调用` + (st.embed_calls ? ` · ${st.embed_calls} 次向量化` : '');
const costFoot = (r, extra = '') => r ? `<div class="st-foot">${extra}用时 ${fmtSec(r.ms)} 秒 · ${callsTxt(r.stats)}</div>` : '';

/* Hermes: rows into state.db (no model), then the model edits the two files with the memory tool */
function wHermes(sid, i, snap) {
  const r = S4().res.hermes[sid];
  const rows = (snap.rows || []).filter(x => x.session_id === sid);
  const s1 = stepHtml(1, '原话直接进 state.db', `
    <div class="w-big">+${rows.length} 行 <span>不调模型</span></div>
    ${rows.map(x => `<div class="sm"><b>${x.role === 'user' ? '用户' : '助手'}</b>${rich(trunc(String(x.content).replace(/^\[[^\]]*\]\s*/, ''), 60))}</div>`).join('')}
    ${r?.parts ? `<div class="st-foot">用时 ${fmtMs(r.parts.sqlite_fts5.ms)} · 0 次模型调用</div>` : ''}`, 'w-db');
  const calls = (snap.ops || []).filter(o => o.session === sid);
  const ops = calls.flatMap(c => (c.args?.operations || [c.args || {}]).map(o => ({ ...o, target: c.args?.target, ok: c.result?.success !== false, usage: c.result?.usage })));
  const opHtml = o => {
    const f = `<span class="hf-tag">${HFILE[o.target] || o.target || ''}</span>`;
    if (o.action === 'add') return `<div class="op add"><span class="op-k">新增</span>${f}${rich(o.content || '')}</div>`;
    if (o.action === 'remove' || (o.action === 'patch' && !o.content)) return `<div class="op del"><span class="op-k">删除</span>${f}<s>${rich(o.old_text || '')}</s></div>`;
    if (o.action === 'patch') return `<div class="op mod"><span class="op-k">改写</span>${f}<s>${rich(o.old_text || '')}</s><div class="op-new">→ ${rich(o.content || '')}</div></div>`;
    return `<div class="op">${escHtml(JSON.stringify(o))}</div>`;
  };
  const hp = r?.parts?.hermes_file;
  const s2 = stepHtml(2, '会话结束，模型自己改两份文件 <code>memory</code>', `
    ${ops.length ? ops.map(opHtml).join('') : '<div class="big-note">模型觉得这段没有要长期记的，文件不变</div>'}
    ${hp ? `<div class="st-foot">调了 ${calls.length} 次 memory 工具 · 用时 ${fmtSec(hp.ms)} 秒 · ${hp.stats.llm_calls} 次模型调用</div>` : ''}`, 'w-ops');
  // file sizes right after this session: the last usage reported for each file up to here
  const upto = (snap.ops || []).filter(o => sIdx(o.session) <= i);
  const lim = { memory: 2200, user: 1375 };
  const bars = Object.keys(HFILE).map(t => {
    const last = upto.filter(o => o.args?.target === t && o.result?.usage).pop();
    const [u, l] = last ? String(last.result.usage).split('/').map(Number) : [0, lim[t]];
    const pct = Math.min(100, Math.round(u / l * 100));
    return `<div class="fbar"><div class="fbar-h"><b>${HFILE[t]}</b><span>${u} / ${l} 字符</span></div><div class="sb big"><i style="width:${pct}%"></i></div></div>`;
  }).join('');
  const s3 = stepHtml(3, '写完后的两份文件', `${bars}
    <div class="note plain">下次开新会话，这两份文件整份放进提示。有字数上限：满了，模型得先删旧的才能记新的</div>`, 'w-files');
  return s1 + ARROW + s2 + ARROW + s3;
}

/* Mem0 2.x: look up similar memories (dedup reference only), one extraction call, ADD only */
function wMem0(sid, i, snap) {
  const r = S4().res.mem0[sid];
  const mems = snap.memories || [];
  const before = mems.filter(m => sIdx(m.metadata?.session) < i).length;
  const res = (snap.add_log || []).filter(x => x.session === sid).flatMap(x => x.result || []);
  const ev = [...new Set(res.map(x => x.event))];
  const s1 = stepHtml(1, '先在库里找最像的旧记忆', `
    <div class="q-card">这段对话</div>
    <div class="flow-down">↓ text-embedding-v4，按相似度找</div>
    <div class="vec-card">库里 ${before} 条 → 取最像的 ${Math.min(10, before)} 条</div>
    <div class="note plain">这些旧记忆只给模型做参考：已经记过的别重复记</div>`, 'w-ref');
  const s2 = stepHtml(2, `一次模型调用，抽出 ${res.length} 条事实`, `
    ${res.map(x => `<div class="m-add"><span class="ev ev-${escHtml(String(x.event).toLowerCase())}">${escHtml(x.event)}</span><span>${rich(x.memory || '')}</span></div>`).join('') || '<div class="big-note">没有抽出新事实</div>'}
    ${costFoot(r)}`, 'w-ext');
  const dots = mems.filter(m => sIdx(m.metadata?.session) <= i)
    .sort((a, b) => sIdx(a.metadata?.session) - sIdx(b.metadata?.session))
    .map(m => `<i class="${m.metadata?.session === sid ? 'new' : ''}" title="${escHtml(m.memory)}"></i>`).join('');
  const s3 = stepHtml(3, `库里 ${before} → ${before + res.length} 条`, `
    <div class="mdots">${dots}</div>
    <div class="note plain">${ev.length === 1 && ev[0] === 'ADD' ? '这一版 Mem0（2.x）写入只做 ADD：不改、不删旧记忆。' : ''}说法前后变了，新旧两条都留在库里，读的时候靠打分排序来挑</div>`, 'w-count');
  return s1 + ARROW + s2 + ARROW + s3;
}

/* Graphiti: entities (new vs merged into existing), relation edges (new / seen again / invalidated), graph */
function gEpisodes(snap) {
  const m = new Map();
  for (const e of snap.episode_nodes || []) m.set(e.uuid, sIdx(e.name));
  return m;
}
function gFirsts(snap) {
  const ep = gEpisodes(snap);
  const nodeFirst = new Map();
  for (const mm of snap.mentions || []) {
    const k = ep.get(mm.source);
    if (k == null || k < 0) continue;
    nodeFirst.set(mm.target, Math.min(nodeFirst.get(mm.target) ?? 99, k));
  }
  const edgeFirst = new Map();
  for (const e of snap.edges || []) {
    const ks = (e.episodes || []).map(u => ep.get(u)).filter(k => k != null && k >= 0);
    edgeFirst.set(e.uuid, ks.length ? Math.min(...ks) : 99);
    for (const n of [e.source, e.target]) if (!nodeFirst.has(n) && ks.length) nodeFirst.set(n, Math.min(...ks));
  }
  return { ep, nodeFirst, edgeFirst };
}

function wGraphiti(sid, i, snap) {
  const s4 = S4();
  const r = s4.res.graphiti[sid];
  const { ep, nodeFirst, edgeFirst } = gFirsts(snap);
  const epU = [...ep.entries()].filter(([, k]) => k === i).map(([u]) => u);
  const name = new Map((snap.nodes || []).map(n => [n.uuid, n.name]));
  const mentioned = [...new Set((snap.mentions || []).filter(m => epU.includes(m.source)).map(m => m.target))];
  const fresh = mentioned.filter(u => nodeFirst.get(u) === i), merged = mentioned.filter(u => nodeFirst.get(u) < i);
  const s1 = stepHtml(1, `抽出 ${mentioned.length} 个实体，和图里已有的合并`, `
    <div class="ent-l">新实体 ${fresh.length}</div>
    <div class="ents">${fresh.map(u => `<span class="ent new">${escHtml(name.get(u) || '?')}</span>`).join('') || '<span class="dim">无</span>'}</div>
    <div class="ent-l">认出是已有实体，合并 ${merged.length}</div>
    <div class="ents">${merged.map(u => `<span class="ent old">${escHtml(name.get(u) || '?')}</span>`).join('') || '<span class="dim">无</span>'}</div>`, 'w-ents');
  const edges = snap.edges || [];
  const newE = edges.filter(e => edgeFirst.get(e.uuid) === i);
  const again = edges.filter(e => edgeFirst.get(e.uuid) < i && (e.episodes || []).some(u => epU.includes(u)));
  // invalidated by this session: compare with the snapshot taken right before it, when we have one
  const prev = i > 0 ? s4.snap.graphiti[s4.sessions[i - 1].id] : null;
  const inval = prev ? edges.filter(e => e.invalid_at && (prev.edges || []).some(x => x.uuid === e.uuid && !x.invalid_at)) : [];
  const row = (e, cls, tag) => `<div class="g-e ${cls}"><span class="op-k">${tag}</span><span class="x">${rich(e.fact || '')}<span class="g-t">${escHtml(humanRel(e.name))} · 生效 ${escHtml(String(e.valid_at || '?').slice(0, 10))}${e.invalid_at ? ' · 失效 ' + escHtml(String(e.invalid_at).slice(0, 10)) : ''}</span></span></div>`;
  const s2 = stepHtml(2, '抽关系边；和旧边矛盾，就给旧边标失效', `
    ${newE.map(e => row(e, 'add', '新边')).join('')}
    ${again.map(e => row(e, 'again', '再次提到')).join('')}
    ${inval.map(e => row(e, 'del', '失效')).join('')}
    ${!newE.length && !again.length && !inval.length ? '<div class="big-note">没有新关系</div>' : ''}
    ${prev && !inval.length ? '<div class="dim w-none">这段没有让旧边失效</div>' : ''}
    ${costFoot(r)}`, 'w-edges');
  const s3 = stepHtml(3, `图里的位置 · 现在 ${[...nodeFirst.values()].filter(k => k <= i).length} 个实体`, '<div class="kg-w" data-kg></div>', 'w-graph');
  return s1 + ARROW + s2 + ARROW + s3;
}

function drawWriteGraph(el, sid, i) {
  const host = $('[data-kg]', el);
  if (!host) return;
  const s4 = S4();
  const snap = s4.snap.graphiti[sid] || s4.insp.graphiti;
  const { ep, nodeFirst, edgeFirst } = gFirsts(snap);
  const epU = [...ep.entries()].filter(([, k]) => k === i).map(([u]) => u);
  const nodes = (snap.nodes || []).filter(n => (nodeFirst.get(n.uuid) ?? 99) <= i);
  const edges = (snap.edges || []).filter(e => (edgeFirst.get(e.uuid) ?? 99) <= i);
  const freshN = new Set((snap.mentions || []).filter(m => epU.includes(m.source)).map(m => m.target));
  const freshE = new Set(edges.filter(e => (e.episodes || []).some(u => epU.includes(u))).map(e => e.uuid));
  const box = host.getBoundingClientRect();
  const W = Math.round(Math.max(400, box.width) * 1.25), H = Math.round(Math.max(300, box.height) * 1.25);
  drawKG(host, { nodes, edges }, { W, H, font: 24, fresh: { nodes: freshN, edges: freshE } });
}

function setButtons() {
  const s4 = S4();
  const allDone = B4.every(b => nextSession(b.key) == null);
  $('#s4-next').disabled = s4.running || allDone;
  $('#s4-all').disabled = s4.running || allDone;
  $('#s4-reset').disabled = s4.running;
}

function nextSession(key) {
  const s4 = S4();
  const done = new Set(s4.written[key] || []);
  return s4.sessions.find(s => !done.has(s.id))?.id || null;
}

async function writeOne(key, session) {
  const s4 = S4();
  const n = sIdx(session) + 1;
  s4.busy[key] = { n, t0: Date.now() };
  delete s4.err[key];
  const follow = !s4.ss;
  paintWSum(key);
  renderSessions();
  if (follow || s4.ss === session) renderWriteDetail();
  let res;
  try {
    res = MOCK_ON ? await mockWrite(key, session) : await api('/api/live/write', { track: 'night-run-live', backend: key, session });
  } catch (err) {
    delete s4.busy[key];
    s4.err[key] = `第 ${n} 段写入失败：${err.message}`;
    paintWSum(key);
    renderSessions();
    renderWriteDetail();
    return false;
  }
  delete s4.busy[key];
  s4.insp[key] = res.inspect;
  s4.snap[key][session] = res.inspect;
  s4.res[key][session] = { ms: res.ms, stats: res.stats, parts: res.parts };
  s4.written[key] = res.written || (s4.written[key] || []).concat(session);
  paintWSum(key);
  renderSessions();
  if (s4.sel === key && (!s4.ss || s4.ss === session)) renderWriteDetail();
  setButtons();
  return true;
}

function trunc(text, n) {
  const s = String(text || '').replace(/\s+/g, ' ').trim();
  return s.length > n ? s.slice(0, n) + '…' : s;
}

async function writeAll() {
  const s4 = S4();
  if (s4.running) return;
  s4.running = true;
  setButtons();
  try {
    await Promise.allSettled(B4.map(async b => {
      for (;;) {
        const sid = nextSession(b.key);
        if (!sid) return;
        if (!(await writeOne(b.key, sid))) return;
      }
    }));
  } finally {
    s4.running = false;
    setButtons();
  }
}

function bindWriteControls() {
  $('#s4-next').addEventListener('click', async () => {
    const s4 = S4();
    if (s4.running) return;
    s4.running = true;
    setButtons();
    try {
      await Promise.allSettled(B4.map(async b => {
        const sid = nextSession(b.key);
        if (sid) await writeOne(b.key, sid);
      }));
    } finally {
      s4.running = false;
      setButtons();
    }
  });
  $('#s4-all').addEventListener('click', writeAll);
  $('#s4-reset').addEventListener('click', async () => {
    const s4 = S4();
    if (s4.running) return;
    if (!confirm('会清空现场库的全部记忆并重新开始，确定？')) return;
    if (MOCK_ON) {
      S.s4 = null;
      await enter4();
      return;
    }
    try {
      await api('/api/live/reset', { track: 'night-run-live' });
      inspectCache.clear();
      await getState(true);
      S.s4 = null;
      await enter4();
    } catch (err) {
      alert('清空失败：' + err.message);
    }
  });
}

/* ---- mock ---- */

async function mockRead(track, b) {
  await delay(260 + Math.random() * 380);
  const s = (MOCK.ask[track] || {})[b.key];
  if (!s) throw new Error('mock 数据缺失');
  return { read: s.read, evidence_ranks: s.evidence_ranks };
}
async function mockAnswer(track, b) {
  await delay(700 + Math.random() * 900);
  const s = (MOCK.ask[track] || {})[b.key];
  if (!s) throw new Error('mock 数据缺失');
  return { inject: s.inject, action: s.action };
}

const MOCK_MS = { sqlite_fts5: 78, hermes_file: 6200, mem0: 7100, graphiti: 14300 };

async function mockWrite(key, session) {
  await delay(420 + Math.random() * 520);
  const s4 = S4();
  const i = s4.sessions.findIndex(s => s.id === session) + 1;
  const snaps = mockSnapshots()[key];
  const inspect = snaps[i - 1];
  return { backend: key, session, ms: MOCK_MS[key] * (0.8 + Math.random() * 0.4), stats: { notes: [] }, inspect, written: (s4.written[key] || []).concat(session) };
}

function mockSnapshots() {
  if (S.snaps) return S.snaps;
  const N = MOCK.inspect['night-run-live'];
  const sess = MOCK.state.tracks['night-run-live'].sessions.map(s => s.id);
  const out = { sqlite_fts5: [], hermes_file: [], mem0: [], graphiti: [] };

  out.sqlite_fts5 = sess.map((_, i) => ({
    kind: 'table', table: 'messages',
    rows: N.sqlite_fts5.rows.filter(r => sess.slice(0, i + 1).includes(r.session_id)),
  }));

  const files = { 'MEMORY.md': [], 'USER.md': [] };
  out.hermes_file = sess.map((sid, i) => {
    for (const op of N.hermes_file.ops.filter(o => o.session === sid)) applyOp(files, op);
    const view = { kind: 'files', files: {}, ops: N.hermes_file.ops.filter(o => sess.slice(0, i + 1).includes(o.session)) };
    for (const [name, entries] of Object.entries(files)) {
      view.files[name] = { entries: entries.slice(), limit: name === 'MEMORY.md' ? 2200 : 1375, used: entries.reduce((a, e) => a + e.length, 0) };
    }
    return view;
  });
  out.hermes_file[out.hermes_file.length - 1] = { kind: 'files', files: N.hermes_file.files, ops: N.hermes_file.ops };

  let mems = [];
  out.mem0 = sess.map((sid, i) => {
    const log = N.mem0.add_log.find(a => a.session === sid);
    for (const ev of (log?.result || [])) {
      if (ev.event === 'ADD') mems.push({ id: ev.id, memory: ev.memory, metadata: { session: sid }, created_at: '' });
      else if (ev.event === 'UPDATE') { const m = mems.find(x => x.id === ev.id); if (m) m.memory = ev.memory; }
      else if (ev.event === 'DELETE') mems = mems.filter(x => x.id !== ev.id);
    }
    return { kind: 'records', memories: mems.map(m => ({ ...m })), add_log: N.mem0.add_log.filter(a => sess.slice(0, i + 1).includes(a.session)) };
  });
  out.mem0[out.mem0.length - 1] = { kind: 'records', memories: N.mem0.memories, add_log: N.mem0.add_log };

  const nameByFact = new Map(N.graphiti.edges.map(e => [e.fact, e.name]));
  const uuidByFact = new Map(N.graphiti.edges.map(e => [e.fact, e.uuid]));
  const invByFact = new Map(N.graphiti.edges.filter(e => e.invalid_at).map(e => [e.fact, e.invalid_at]));
  let edges = [];
  out.graphiti = N.graphiti.episodes.map((ep, i) => {
    for (const e of ep.edges) {
      const key = e.fact + '|' + e.valid_at;
      if (!edges.find(x => x.key === key)) {
        edges.push({ key, uuid: uuidByFact.get(e.fact) || key, fact: e.fact, name: nameByFact.get(e.fact) || '', valid_at: e.valid_at, invalid_at: null });
      }
    }
    for (const e of edges) {
      const inv = invByFact.get(e.fact);
      if (inv && !e.invalid_at && inv <= ep.reference_time) e.invalid_at = inv;
    }
    const names = new Set(N.graphiti.episodes.slice(0, i + 1).flatMap(x => x.nodes));
    return {
      kind: 'graph',
      nodes: N.graphiti.nodes.filter(n => names.has(n.name)),
      edges: edges.map(e => ({ ...e })),
      episodes: N.graphiti.episodes.slice(0, i + 1),
    };
  });
  out.graphiti[out.graphiti.length - 1] = { kind: 'graph', nodes: N.graphiti.nodes, edges: N.graphiti.edges, episodes: N.graphiti.episodes };

  S.snaps = out;
  return out;
}

function applyOp(files, op) {
  const list = op.args?.operations || [op.args || {}];
  const target = op.args?.target || list[0]?.target || 'memory';
  for (const o of list) {
    const t = o.target || target;
    const key = t === 'user' ? 'USER.md' : 'MEMORY.md';
    const arr = files[key] || (files[key] = []);
    if (o.action === 'add') arr.push(o.content);
    else if (o.action === 'patch') {
      const idx = arr.findIndex(e => o.old_text && (e.startsWith(o.old_text) || e.includes(o.old_text)));
      if (idx >= 0) arr[idx] = o.content; else arr.push(o.content);
    } else if (o.action === 'remove') {
      const idx = arr.findIndex(e => o.old_text && (e.startsWith(o.old_text) || e.includes(o.old_text)));
      if (idx >= 0) arr.splice(idx, 1);
    }
  }
}

/* ---------------- 6 · 花多少 ---------------- */

/* ---------------- 写入花多少 · 读取花多少 ---------------- */

const WCOST_HOW = {
  hermes: '原话入库不调模型；会话结束时 Agent 改两份文件，要调模型',
  mem0: '每段一次抽取；比对旧记忆、存新记忆都要先变成向量',
  graphiti: '抽实体 → 合并 → 抽关系 → 判断失效，每一步都调模型',
};
const kTok = t => t >= 10000 ? `${Math.round(t / 1000)}k` : t >= 1000 ? `${(t / 1000).toFixed(1)}k` : `${t}`;

async function loadWriteCost() {
  if (S.wcost) return S.wcost;
  if (REPLAY) S.wcost = await rpJson('write_cost.json');
  else {
    const r = await fetch('/write_cost.json', { cache: 'no-cache' });
    if (!r.ok) throw new Error(`没有写入记录（HTTP ${r.status}）`);
    S.wcost = await r.json();
  }
  return S.wcost;
}

function storeTxt(key, st) {
  if (key === 'hermes') return `state.db <b>${st.rows}</b> 行 · 两份文件 <b>${st.file_chars}</b> 字`;
  if (key === 'mem0') return `<b>${st.memories}</b> 条记忆`;
  return `<b>${st.nodes}</b> 个实体 · <b>${st.edges}</b> 条关系`;
}

async function enterWriteCost() {
  window.__liveReady = false;
  const host = $('#swc-body');
  try {
    const W = await loadWriteCost();
    const ids = W.sessions.map(x => x.id);
    const rows = B4.map(b => {
      const ss = W.systems[b.key].sessions;
      const sum = k => ids.reduce((a, id) => a + ((ss[id] || {})[k] || 0), 0);
      const dbMs = ids.reduce((a, id) => a + (((ss[id] || {}).parts || {}).sqlite_fts5?.ms || 0), 0);
      return { b, ss, ms: sum('ms'), calls: sum('llm_calls'), tok: sum('tokens'),
               emb: sum('embed_calls'), etok: sum('embed_tokens'), dbMs, store: W.systems[b.key].store };
    });
    const max = Math.max(...rows.map(r => r.ms));
    $('#swc-stamp').textContent = `${W.recorded_at} 的一次真实运行 · 三个系统同时写`;
    host.innerHTML = `<div class="wc-head"><span></span><span>六段一共用时（每格一段）</span><span>模型调用</span><span>向量化</span><span>写完库里有</span></div>` +
      rows.map(r => `<div class="wc-row ${r.b.key}">
        <div class="wc-name"><b>${escHtml(r.b.name)}</b><span>${escHtml(WCOST_HOW[r.b.key])}</span></div>
        <div class="wc-time"><div class="wc-big">${fmtSec(r.ms)}<small> 秒</small></div>
          <div class="wc-bar">${ids.map((id, i) => {
            const ms = (r.ss[id] || {}).ms || 0;
            return `<div class="wc-seg" style="width:${(ms / max) * 100}%" title="第 ${i + 1} 段 ${fmtSec(ms)} 秒">${ms / max > 0.045 ? `<span>${fmtSec(ms)}</span>` : ''}</div>`;
          }).join('')}</div>
          ${r.b.key === 'hermes' ? `<div class="wc-sub">其中原话入库共 ${r.dbMs} ms，其余是改文件</div>` : ''}</div>
        <div class="wc-n"><div class="wc-big">${r.calls}<small> 次</small></div><div class="wc-sub">${kTok(r.tok)} tokens</div></div>
        <div class="wc-n"><div class="wc-big">${r.emb}<small> 次</small></div><div class="wc-sub">${r.emb ? kTok(r.etok) + ' tokens' : '不用向量'}</div></div>
        <div class="wc-store">${storeTxt(r.b.key, r.store)}</div>
      </div>`).join('');
    $('#swc-note').textContent = `模型 ${W.model} · 一次运行的结果：用时取决于当时接口的速度，只看量级和花在哪一步。`;
  } catch (err) {
    host.innerHTML = `<div class="loading">读取失败：${escHtml(err.message)}</div>`;
  }
  window.__liveReady = true;
}

function enterReadCost() {
  const host = $('#src-body');
  const c = (S.cost || {})[5] || {};
  const done = BACKENDS.filter(b => c[b.key]);
  const q = done.length ? String(c[done[0].key].prompt || "").split("\n").filter(l => !l.startsWith("[系统时间]")).join(" ").trim() : "";
  $('#src-q').textContent = q ? `“${q}”` : '';
  if (!done.length) {
    host.innerHTML = `<div class="rc-empty">上一页还没问问题。按 ← 回去问一个，再翻过来。</div>`;
    window.__liveReady = true;
    return;
  }
  const maxChars = Math.max(1, ...done.map(b => c[b.key].chars));
  const how = (b, x) => b.key === 'control' ? '不找' : b.key === 'hermes' ? '读两份文件（整份）' : b.key === 'mem0' ? '问题变向量，给每条记忆打分' : '关键词 + 向量两路，再融合';
  const cell = (b, f) => c[b.key] ? f(c[b.key]) : '<span class="dim">还在跑</span>';
  const row = (label, f, cls = '') => `<div class="rcx-row ${cls}"><div class="rcx-l">${label}</div>${BACKENDS.map(b => `<div class="rcx-c">${cell(b, f(b))}</div>`).join('')}</div>`;
  host.innerHTML = `<div class="rcx-row rcx-h"><div class="rcx-l"></div>${BACKENDS.map(b => `<div class="rcx-c"><b>${escHtml(b.name)}</b></div>`).join('')}</div>` +
    row('① 怎么找', b => x => `<div class="rcx-how">${how(b, x)}</div>`) +
    row('检索用时', b => x => b.key === 'control' ? '<span class="dim">—</span>' : `<span class="rcx-big">${fmtMs(x.read_ms)}</span>${b.key === 'hermes' ? '<div class="rcx-sub">只是读文件</div>' : '<div class="rcx-sub">含 1 次向量化</div>'}`) +
    row('② 放进上下文', b => x => `<span class="rcx-big">${x.chars}</span> 字<div class="rcx-bar"><i style="width:${x.chars / maxChars * 100}%"></i></div>${b.key === 'hermes' ? '<div class="rcx-sub">每次新会话都整份带上</div>' : b.key === 'control' ? '' : `<div class="rcx-sub">取回 ${x.hits} 条</div>`}`) +
    row('③ 作答时又去搜', b => x => b.key === 'hermes' ? `<span class="rcx-big">${x.searches}</span> 次 session_search` : '<span class="dim">不能搜</span>') +
    row('作答', b => x => `<span class="rcx-big">${x.llm_calls}</span> 次模型调用 · <span class="rcx-big">${kTok(x.tokens)}</span> tokens<div class="rcx-sub">用时 ${fmtSec(x.ans_ms)} 秒</div>`);
  window.__liveReady = true;
}

/* ---------------- boot ---------------- */

function tick() {
  const now = Date.now();
  $$('.timer').forEach(el => {
    el.textContent = ((now - Number(el.dataset.t0)) / 1000).toFixed(1) + ' s';
  });
  $$('[data-busy]').forEach(el => {
    const b = S4()?.busy?.[el.dataset.busy];
    if (!b) return;
    el.textContent = `第 ${b.n} 段 · 写入中 ${((now - b.t0) / 1000).toFixed(1)} s`;
  });
}

function replayBadge() {
  if (!REPLAY) return;
  const el = document.createElement('div');
  el.id = 'replay-badge';
  el.style.cssText = 'position:fixed;left:14px;bottom:10px;font-size:12px;color:#8C857B;opacity:.85;z-index:50;pointer-events:none';
  el.textContent = '回放 · 结果和耗时来自真实运行' + (RP.speed !== 1 ? ` · ${RP.speed}× 速` : '');
  document.body.appendChild(el);
  rpLoad().then(R => { el.textContent = `回放 · 结果和耗时来自 ${R.recorded_at} 的真实运行` + (RP.speed !== 1 ? ` · ${RP.speed}× 速` : ''); }).catch(() => {});
}

function boot() {
  replayBadge();
  fit();
  buildS1();
  bindWriteControls();
  const n = hashNum();
  const step = parseInt(QS.get('step') || '0', 10);
  S.stepMode = MOCK_ON && step > 0;
  window.__liveReady = !(AUTO && (ORDER[n - 1] === 3 || ORDER[n - 1] === 5)) && !S.stepMode;
  show(n);
  if (MOCK_ON && step > 0) prepMockStep(step);
}

async function prepMockStep(step) {
  if (S.screen !== 4) { window.__liveReady = true; return; }
  for (let i = 0; i < 200 && !(S.s4 && S.s4.loaded); i++) await delay(20);
  if (!S.s4) { window.__liveReady = true; return; }
  S.s4.written = Object.fromEntries(B4.map(b => [b.key, []]));
  S.s4.insp = {};
  setupWrite();
  renderSessions();
  for (let k = 0; k < step; k++) {
    for (const b of B4) {
      const sid = nextSession(b.key);
      if (!sid) continue;
      await writeOne(b.key, sid);
    }
  }
  setButtons();
  window.__liveReady = true;
}

setInterval(tick, 100);
boot();

})();
