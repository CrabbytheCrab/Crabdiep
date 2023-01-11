local mod = RegisterMod("The Crab Pack", 1)
local sound = SFXManager()
local game = Game()
local rng = RNG()
local room = game:GetRoom()
local level = game:GetLevel()
local hud = game:GetHUD()
local chainLink = Isaac.GetEntityVariantByName("Chainlink")
local Blighted = Isaac.GetEntityVariantByName("The Blighted")
local Sealed = Isaac.GetEntityVariantByName("Sealed")
local Bomb = Isaac.GetEntityVariantByName("Bombardier")
local Maiden = Isaac.GetEntityVariantByName("Maiden")
local Maiden2 = Isaac.GetEntityVariantByName("Pharaoh's tomb")
local Donk = Isaac.GetEntityVariantByName("Danker")
local HangDonk = Isaac.GetEntityVariantByName("Hanging Danker")
local Blastglob = Isaac.GetEntityVariantByName("Blaster Globlin")
local Shroomy = Isaac.GetEntityVariantByName("Shroomy")
local TaintedShroomy = Isaac.GetEntityVariantByName("Tainted Shroomy")
local Camilloa = Isaac.GetEntityVariantByName("Camillo")
local MiniCamillo = Isaac.GetEntityVariantByName("Mini Camillo")
local Holl = Isaac.GetEntityVariantByName("The Holy One")
local ShroomyWalk = Isaac.GetEntityVariantByName("Rambling Shroomy")
local AgedBoney = Isaac.GetEntityVariantByName("Enraged Bones2")
local one_hundred_and_nine = 109


local function getProjectiles()
    local projectiles = {}
  
    for _, v in pairs(Isaac.FindByType(EntityType.ENTITY_PROJECTILE)) do
      local proj = v:ToProjectile()
      table.insert(projectiles, proj)
    end
  
    return projectiles
  end
  
  
  ---@param oldEntities EntityProjectile[]
  ---@param newEntities EntityProjectile[]
  local function getFilteredNewEntities(oldEntities, newEntities)
    local oldEntityList = {}
    local filteredEntities = {}
  
    for _, v in pairs(oldEntities) do
      local hash = GetPtrHash(v)
      oldEntityList[hash] = true
    end
    
    for _, v in pairs(newEntities) do
      local hash = GetPtrHash(v)
      if not oldEntityList[hash] then
        table.insert(filteredEntities, v)
      end
    end
  
    return filteredEntities
  end
  
  ---@param npc EntityNPC
  ---@param position Vector
  ---@param velocity Vector
  ---@param projectilesMode number?
  ---@param projectileParams ProjectileParams?
  local function fireProjectiles(npc, position, velocity, projectilesMode, projectileParams)
    projectilesMode = projectilesMode or 1
    projectileParams = projectileParams or ProjectileParams()
    local oldProjectiles = getProjectiles()
    npc:FireProjectiles(position, velocity, projectilesMode, projectileParams)
    local newProjectiles = getProjectiles()
    return getFilteredNewEntities(oldProjectiles, newProjectiles)
  end


local function getRandomSeed()
    local randomNumber = Random()
    local safeRandomNumber = randomNumber == 0 and 1 or randomNumber
    return safeRandomNumber
end

local function setSeed(rng, seed)
    if seed == 0 then
        error("You cannot set an RNG object to a seed of 0, or the game will crash.")
    end
    rng:SetSeed(seed, 35)
end
local function DiagonalMove(npc, speed, thirdboolean, xmult)
    xmult = xmult or 1
    local xvel = speed * xmult
    local yvel = speed
    if npc.Velocity.X < 0 then
        xvel = xvel * -1
    end
    if npc.Velocity.Y < 0 then
        yvel = yvel * -1
    end
  
    if npc:HasEntityFlags(EntityFlag.FLAG_FEAR) then
        if npc:GetPlayerTarget() then
            local pdist = npc:GetPlayerTarget().Position:Distance(npc.Position)
            if pdist < 100 then
                local vec = (npc.Position - npc:GetPlayerTarget().Position):Resized(math.max(5, 10 - pdist/20))
                xvel = vec.X
                yvel = vec.Y
            end
        end
    end
    if npc:HasEntityFlags(EntityFlag.FLAG_CONFUSION) then
    end
    if thirdboolean then
        return Vector(xvel, yvel)
    else
        npc.Velocity = Vector(xvel, yvel)
    end
  end
local function newRNG(seed)
    if seed == nil then
        seed = getRandomSeed()
    end
    local rng = RNG()
    setSeed(rng, seed)
    return rng
end

local function getRandomInt(min, max, seedOrRNG)
    if seedOrRNG == nil then
        seedOrRNG = getRandomSeed()
    end
    local rng = seedOrRNG or newRNG(seedOrRNG)
    if min > max then
        local oldMin = min
        local oldMax = max
        min = oldMax
        max = oldMin
    end
    return rng:RandomInt(max - min + 1) + min
end

local function lerpVector(vector1, vector2, alpha)
    return vector1 + (vector2 - vector1) * alpha
  end
  
  local function getConfusionPosition(npc)
    local hash = GetPtrHash(npc)
    local data = npc:GetData()
  
    if npc.FrameCount % 10 == 0 or not data.PathfindingConfusionData then
        data.PathfindingConfusionData = npc.Position + RandomVector() * getRandomInt(20, 30)
    elseif npc.Position:Distance(data.offset) <= 5 then
        data.PathfindingConfusionData = npc.Position
    end
    return data.PathfindingConfusionData
  end
  
  local function runToTarget(npc, target, speed)
    local targetPosition
    local room = Game():GetRoom()
    --speed = 1
    --target = npc:GetPlayerTarget()
    if npc:HasEntityFlags(EntityFlag.FLAG_CONFUSION) then
        targetPosition = getConfusionPosition(npc)
    elseif target == nil then
        targetPosition = npc:GetPlayerTarget().Position
    else
        targetPosition = target
    end
    if npc:HasEntityFlags(EntityFlag.FLAG_FEAR) then
        local targetVelocity = (targetPosition - npc.Position):Resized(-speed - 2)
        npc.Velocity = lerpVector(npc.Velocity, targetVelocity, 0.3)
    elseif room:CheckLine(
        npc.Position,
        targetPosition,
       0,
        200,
        true,
        false
    ) or npc.GridCollisionClass ~= EntityGridCollisionClass.GRIDCOLL_GROUND and npc.GridCollisionClass ~= EntityGridCollisionClass.GRIDCOLL_NO_PITS then
        local targetVelocity = (targetPosition - npc.Position):Resized(speed)
        npc.Velocity = lerpVector(npc.Velocity, targetVelocity, 0.3)
    else
        npc.Pathfinder:FindGridPath(targetPosition, speed / 6, 0, false)
    end
    if room:GetGridPathFromPos(npc.Position) <= 900 then
        room:SetGridPath(
            room:GetGridIndex(npc.Position),
            900
        )
    end
  end


function mod.IsPositionOnScreen(pos)
    local myScreenPosition = Isaac.WorldToScreen(pos)
    return (
      myScreenPosition.X >= 0 and
      myScreenPosition.Y >= 0 and
      myScreenPosition.X <= Isaac.GetScreenWidth() and
      myScreenPosition.Y <= Isaac.GetScreenHeight()
    )
  end
  local function countShutDoors()
    local count = 0
    for _, npc in pairs(Isaac.GetRoomEntities()) do
      if npc:CanShutDoors() then
        count = count + 1
      end
    end
    return count
  end


  local function countGloblins()
    local globcount = 0
    for _, npc in pairs(Isaac.GetRoomEntities()) do
      if npc.Type == 24 then
        if npc.SpawnerType == 327 then
            globcount = globcount + 1
        end
      end
    end
    return globcount
  end



  function mod:CustomTearEffects(projectile)
    local data = projectile:GetData()
    data.cansplit = false
    data.Zelotshot = false
    data.timedfall = false
    data.dontremove = false
    data.poofshot = false
    data.lasershot = false
    data.shroomshot = false
    data.dankshot = false
    data.maxslow = projectile.Velocity/2
    data.randomrot = false
end
mod:AddCallback(ModCallbacks.MC_POST_PROJECTILE_INIT, mod.CustomTearEffects)

function mod:Lasereffectsinit(laser)
    local data = laser:GetData()
    data.thinlaser = false
    data.tlX = 0
    data.tlY = 0
end
mod:AddCallback(ModCallbacks.MC_POST_LASER_INIT, mod.Lasereffectsinit)

function mod:Lasereffects(laser)
    local data = laser:GetData()
    if data.thinlaser == true then
        laser.Size = 0.5
        laser.Visible = true
        laser.SpriteScale = Vector(0.5, 0.5)
        laser:Update()
    end
end
mod:AddCallback(ModCallbacks.MC_POST_LASER_UPDATE, mod.Lasereffects)


function mod:onNpc(npc)
    if npc.Type == 25 and npc.Variant == 20 and npc.SubType == 0 then
        local player = npc:GetPlayerTarget()
        local pos = npc.Position
        local Y = npc.Velocity.Y
        local X = npc.Velocity.X
        local FRICTION = 0.8 
        --npc.Velocity = Vector(0,0)
        if npc:HasEntityFlags(EntityFlag.FLAG_CONFUSION) or npc:HasEntityFlags(EntityFlag.FLAG_FEAR) then
        else
            if Input.IsActionPressed(ButtonAction.ACTION_SHOOTLEFT, 0) then
                npc.Velocity = npc.Velocity * FRICTION + Vector(2,0)
            end
            if Input.IsActionPressed(ButtonAction.ACTION_SHOOTRIGHT, 0) then
                npc.Velocity = npc.Velocity * FRICTION + Vector(-2,0)
            end
            if Input.IsActionPressed(ButtonAction.ACTION_SHOOTUP, 0) then
                npc.Velocity = npc.Velocity * FRICTION + Vector(0,2)
            end
            if Input.IsActionPressed(ButtonAction.ACTION_SHOOTDOWN, 0) then
                npc.Velocity = npc.Velocity * FRICTION + Vector(0,-2)
            end
        end
        if npc:IsDead() then
            local param = ProjectileParams()
            local params = ProjectileParams()
            params.Variant = 4
            params.HeightModifier = 2
            --params.FallingAccelModifier = 0.005
            params.Scale = 1.8
            params.ChangeTimeout = 150
            params.BulletFlags = ProjectileFlags.SMART | ProjectileFlags.EXPLODE
            local projectiles = fireProjectiles(npc, pos, Vector(0,0):Rotated(0), 0, params)
            local projectile = projectiles[1]
            local data = projectile:GetData()
            data.timedfall = true
                               -- param.Scale = 1.1
        end
        if npc:IsChampion() then
            npc:GetSprite():ReplaceSpritesheet(0, "gfx/monsters/custom/enemy.hushboomfly_bluewomb_champion.png")
            npc:GetSprite():LoadGraphics()
        end
    end
end

mod:AddCallback(ModCallbacks.MC_NPC_UPDATE, mod.onNpc)


function mod:bluefly(npc)
    if npc.Type == 25 and npc.Variant == 20 and npc.SubType == 0 then
        local backdrop = room:GetBackdropType()
        if backdrop == BackdropType.BLUE_WOMB then
            npc.MaxHitPoints = npc.MaxHitPoints/2
            local champ = npc:GetChampionColorIdx()
            if not npc:IsChampion() then
                npc:GetSprite():ReplaceSpritesheet(0, "gfx/monsters/custom/enemy.hushboomfly_bluewomb.png")
                npc:GetSprite():LoadGraphics()
            end
            if npc:IsChampion() then
                npc:GetSprite():ReplaceSpritesheet(0, "gfx/monsters/custom/enemy.hushboomfly_bluewomb_champion.png")
                npc:GetSprite():LoadGraphics()
            end
        end
    end 
end
mod:AddCallback(ModCallbacks.MC_POST_NPC_INIT, mod.bluefly)

function mod:blueflytearhandler(projectile)
    if not projectile.SpawnerEntity then
        return
    elseif projectile.SpawnerEntity.Type == 25 and projectile.SpawnerEntity.Variant == 20 then
        if projectile.Variant == 0 then
            if projectile.SpawnerEntity:IsDead() then
                projectile:Remove()
            end
        end
    end
end

mod:AddCallback(ModCallbacks.MC_POST_PROJECTILE_INIT, mod.blueflytearhandler)



function mod:onNpc2(npc)
    if npc.Type == 25 and npc.Variant == 21 then
        local pos = npc.Position
        if npc.StateFrame == 30 then
            npc.State = NpcState.STATE_ATTACK
        end
        if npc:GetSprite():IsFinished("Attack") then
            npc.State = NpcState.STATE_MOVE
        end
        if npc:HasEntityFlags(EntityFlag.FLAG_CONFUSION) or npc:HasEntityFlags(EntityFlag.FLAG_FEAR) then
            npc.StateFrame = npc.StateFrame
        else
            local FRICTION = 0.8 
            if npc.State == NpcState.STATE_MOVE then
                npc.StateFrame = npc.StateFrame + 1
            end

            if npc.State == NpcState.STATE_ATTACK then
                npc.StateFrame = 0
                npc:GetSprite():Play("Attack", false)
            end
        end
        if npc:GetSprite():IsEventTriggered("Shoot") then
            if npc:HasEntityFlags(EntityFlag.FLAG_CONFUSION) or npc:HasEntityFlags(EntityFlag.FLAG_FEAR) then
            else
                local params = ProjectileParams()
                sound:Play(SoundEffect.SOUND_TEARS_FIRE, 1, 0, false, 1)
                params.Variant = 4
                params.HeightModifier = 2
                --params.FallingAccelModifier = 0.005
                params.ChangeTimeout = 60
                local projectiles = fireProjectiles(npc, pos, Vector(0,0):Rotated(0), 0, params)
                local projectile = projectiles[1]
                local data = projectile:GetData()
                data.timedfall = true
            end
        end
        if npc:IsDead() then
            sound:Play(SoundEffect.SOUND_ISAACDIES, 1, 0, false, 1.2)
            local params = ProjectileParams()
            params.Variant = 4
            params.HeightModifier = 2
            --params.FallingAccelModifier = 0.005
            params.Scale = 2
            params.ChangeTimeout = 120
            local projectiles = fireProjectiles(npc, pos, Vector(0,0):Rotated(0), 0, params)
            local projectile = projectiles[1]
            local data = projectile:GetData()
            data.timedfall = true
        end
    end
end
mod:AddCallback(ModCallbacks.MC_NPC_UPDATE, mod.onNpc2)

function mod:onUpdateProjectileIfly(projectile)
    local pos = projectile.Position
    local data = projectile:GetData()
    local player = Isaac.GetPlayer(rng:RandomInt(game:GetNumPlayers()))
	if data.timedfall == true then
        if projectile.ChangeTimeout > 0 then
            projectile.FallingAccel = -0.1            
                projectile.FallingSpeed = 0
        end
        projectile.ChangeTimeout = projectile.ChangeTimeout - 1
        if projectile.ChangeTimeout <= 0 then
            projectile.FallingSpeed = projectile.FallingSpeed + 0.1
            --projectile.FallingAccel = projectile.FallingAccel + 0.1
        end
	end
end
mod:AddCallback(ModCallbacks.MC_POST_PROJECTILE_UPDATE, mod.onUpdateProjectileIfly)

function mod:Iflytearhandler(projectile)
    if not projectile.SpawnerEntity then
        return
    elseif projectile.SpawnerEntity.Type == 25 and projectile.SpawnerEntity.Variant == 21 then
        data = projectile:GetData()
        data.fall = false
         if projectile.Variant == 0 then
            if projectile.SpawnerEntity:IsDead() then
                projectile:Remove()
            end
        end
    end
end

mod:AddCallback(ModCallbacks.MC_POST_PROJECTILE_INIT, mod.Iflytearhandler)

CFState =
{
FLY = 4,
APPEAR = 1,
ATTACK = 5,
}
function mod:coalfly(npc)
    local data = npc:GetData()
    local player = npc:GetPlayerTarget()
    local pos = npc.Position
    local Rot = (player.Position - npc.Position):GetAngleDegrees()
    if npc.Type == 25 and npc.Variant == 0 and npc.SubType == 22 then
        if npc:IsDead() then
            local params = ProjectileParams()
            params.Variant = 9
            npc:FireProjectiles(pos, Vector(10,6), 9, params)
        end
        if npc:GetSprite():IsPlaying("Appear") then
            npc.State = NpcState.STATE_APPEAR
        end
        if npc:GetSprite():IsPlaying("Heat up") then
            npc.State = NpcState.STATE_ATTACK2
        end
        if npc:GetSprite():IsPlaying("Fly") then
            npc.State = NpcState.STATE_MOVE
        end
        if npc:GetSprite():IsPlaying("Cool down") then
            npc.State = NpcState.STATE_ATTACK2
        end
        if npc:GetSprite():IsPlaying("Attack") then
            npc.State = NpcState.STATE_ATTACK
        end
        if npc.State == NpcState.STATE_MOVE or npc.State == NpcState.STATE_ATTACK or npc.State == NpcState.STATE_ATTACK2 or npc.State == NpcState.STATE_ATTACK3 then
            if mod.IsPositionOnScreen(pos) then
                npc.StateFrame = npc.StateFrame + 1
            end
        end
        if npc.StateFrame == 130 then
            for i = 0, 6 do
                local effect = Isaac.Spawn(1000, 147, 0, pos + Vector(-50,0):Rotated(60 * i), Vector(0, 0), npc)
            end
        end
        if npc.StateFrame == 60 then
            npc:GetSprite():Play("Heat up", false)
            npc.State = NpcState.STATE_ATTACK2
        end
        if npc.StateFrame == 72 then
            npc:GetSprite():Play("Attack", false)
            npc.State = NpcState.STATE_ATTACK
        end
        if npc.State == NpcState.STATE_ATTACK then
            local FRICTION = 0.8
            local YOUR_SPEED = 30
            npc.Velocity = Vector(0,0)
            runToTarget(npc, nil, YOUR_SPEED) 
            data.fire = data.fire + 1
            if data.fire == 5 then
                data.fire = 0
                effect = Isaac.Spawn(33,10,0,pos + Vector(-10,0):Rotated(Rot),Vector(0,0),npc)
            end
        end
        if npc.StateFrame == 120 then
            npc:GetSprite():Play("Cool down", false)
            npc.State = NpcState.STATE_ATTACK2
        end
        if npc.StateFrame >= 132 then
            npc:GetSprite():Play("Fly", true)
            npc.State = NpcState.STATE_MOVE
            npc.StateFrame = 0
        end
    end
end

mod:AddCallback(ModCallbacks.MC_NPC_UPDATE, mod.coalfly)

function mod:coalfly_Init(npc)
    if npc.Type == 25 and npc.Variant == 0 and npc.SubType == 22 then
        local data = npc:GetData()
        data.fire = 0
        npc.State = 1
        data.Rage = 0
    end
end
mod:AddCallback(ModCallbacks.MC_POST_NPC_INIT, mod.coalfly_Init)


function mod:coalflyprespawn(Type,variant,subtype,_,seed)
    if Type == 25 and variant == 0 and subtype == 22 then
        return {25, 0, 22,1, seed}
    end
end
mod:AddCallback(ModCallbacks.MC_PRE_ROOM_ENTITY_SPAWN, mod.coalflyprespawn)

function mod:CoalFire(npc)
    if not npc.SpawnerEntity then
        return
    end
    if npc.SpawnerEntity.Type == 25 and npc.SpawnerEntity.SubType == 22 then
        if npc.Type == 33 and npc.Variant == 10 then
            npc.Scale = 1 - npc.StateFrame/15
            npc.StateFrame = npc.StateFrame + 1
            if npc.StateFrame == 15 then 
                npc:Die()
            end
        end
	end
end
mod:AddCallback(ModCallbacks.MC_NPC_UPDATE, mod.CoalFire)


function mod:onNpc3(npc)
    local params = ProjectileParams()
    params.Variant = 1
    params.Spread = 0.5
    if npc.Type == 834 and npc.Variant == 20 then
        local champ = ""
		if npc:IsChampion() then
			champ = "_champion"
		end
        if npc:GetSprite():IsOverlayPlaying("HeadLaughUp") or npc:GetSprite():IsOverlayPlaying("HeadLaughLeft") or npc:GetSprite():IsOverlayPlaying("HeadLaughRight") or npc:GetSprite():IsOverlayPlaying("HeadLaughDown") then
            if npc:GetSprite():GetOverlayFrame() > 1 and npc:GetSprite():GetOverlayFrame() < 16 then
                npc:GetSprite():ReplaceSpritesheet(0, "gfx/monsters/custom/enraged_body2" .. champ .. ".png")
                npc:GetSprite():LoadGraphics()
            else
                npc:GetSprite():ReplaceSpritesheet(0, "gfx/monsters/custom/enraged_body" .. champ .. ".png")
                npc:GetSprite():LoadGraphics()
            end
        end
        if npc:GetSprite().FlipX == true then
                npc:GetSprite():ReplaceSpritesheet(1, "gfx/monsters/custom/enemy.enraged_boney_flipped" .. champ .. ".png")
                npc:GetSprite():LoadGraphics()
        end
        if npc:GetSprite().FlipX == false then
            npc:GetSprite():ReplaceSpritesheet(1, "gfx/monsters/custom/enemy.enraged_boney" .. champ .. ".png")
            npc:GetSprite():LoadGraphics()
        end            
        if npc:GetSprite():IsEventTriggered("Shoot") then
            sound:Play(SoundEffect.SOUND_SCAMPER, 1, 0, false, 1)
            local pos = npc.Position
            if npc:GetSprite():IsPlaying("AttackHori") then
                if npc:GetSprite().FlipX == true then
                    npc:FireProjectiles(pos, Vector(10,0):Rotated(180), 3, params)
                else
                    npc:FireProjectiles(pos, Vector(10,0):Rotated(0), 3, params)
                end
            end
            if npc:GetSprite():IsPlaying("AttackUp") then
                npc:FireProjectiles(pos, Vector(10,0):Rotated(270), 3, params)
            end
            if npc:GetSprite():IsPlaying("AttackDown") then
                npc:FireProjectiles(pos, Vector(10,0):Rotated(90), 3, params)
            end
        end
    end
end



mod:AddPriorityCallback(ModCallbacks.MC_NPC_UPDATE, -1, mod.onNpc3)
local CandlerVariant ={
	Zel = Isaac.GetEntityVariantByName("Zelot")
}
local Purp = Isaac.GetEntityVariantByName("Purple Fire Projectile(Purple)")


function mod:onNpc4(npc)
    if npc.Type == 833 and npc.Variant == 20 then
        if npc:GetSprite():IsEventTriggered("Shoot") then
            local player = npc:GetPlayerTarget()
            local pos = npc.Position
            local vec = player.Position - npc.Position
            local Rot = (player.Position - npc.Position):GetAngleDegrees()
            local params = ProjectileParams()
            params.ChangeTimeout = 120
           -- params.BulletFlags =  ProjectileFlags.BOUNCE | ProjectileFlags.SMART | ProjectileFlags.CHANGE_FLAGS_AFTER_TIMEOUT | ProjectileFlags.CURVE_LEFT
            params.BulletFlags =  ProjectileFlags.SMART
            params.HomingStrength = 0.25
            params.HeightModifier = 10 
            params.Scale = 1.5
            --params.FallingAccelModifier = -0.2
            --params.CurvingStrength = -0.005
            params.Variant = 2
            local projectiles = fireProjectiles(npc, pos, Vector(2.5,0):Rotated(Rot), 0, params)
            local projectile = projectiles[1]
            local data = projectile:GetData()
            data.Zelotshot = true
        end
        if npc:IsDead() then
           local effect = Isaac.Spawn(1000,148,1,npc.Position,Vector(0,0):Rotated(0),npc):ToEffect()
           effect.Rotation = Rot
        end
        if npc:GetSprite():IsEventTriggered("Shoot") then
            local pos = npc.Position
           local flame = Isaac.Spawn(33,13,0,pos,Vector(0,0):Rotated(0),npc):ToNPC()
            local color = Color(1, 1, 1, 1, 0, 0, 0)
            color:SetColorize(1, 0.3, 2.2, 1)
            local sprite = flame:GetSprite()
            sprite.Color = color
        end
    end
end

mod:AddPriorityCallback(ModCallbacks.MC_NPC_UPDATE, -1, mod.onNpc4)


function mod:zelshot(projectile)
    local pos = projectile.Position
    local data = projectile:GetData()
        if data.Zelotshot == true then
            local flag = projectile:GetEntityFlags()
            projectile.FallingAccel = -0.1
            projectile.FallingSpeed = 0
            local color = Color(1, 1, 1, 1, 0, 0, 0)
            color:SetColorize(1, 0.3, 2.2, 1)
            local sprite = projectile:GetSprite()
            sprite.Color = color
            projectile.ChangeTimeout = projectile.ChangeTimeout - 1
            if projectile.ChangeTimeout <= 0 then
                projectile:Die()
                --sound:Play(SoundEffect.SOUND_FIREDEATH_HISS, 1, 0, false, 1)
            end
    end
end
mod:AddCallback(ModCallbacks.MC_POST_PROJECTILE_UPDATE, mod.zelshot)


function mod:Fire(npc)
    if	npc.SpawnerType == 833 and npc.SpawnerVariant == 20 then
		if npc.Type == 33 and npc.Variant == 10 then
        	npc:Die()
        end
	end
end
mod:AddCallback(ModCallbacks.MC_POST_NPC_INIT, mod.Fire)
function mod:Fireup(npc)
    if	npc.SpawnerType == 833 and npc.SpawnerVariant == 20 then
        if npc.Type == 33 and npc.Variant == 13 then
            npc.Scale = 1 - npc.StateFrame/100
            npc.SizeMulti = Vector(1 - npc.StateFrame/100,1 - npc.StateFrame/100)
            npc.StateFrame = npc.StateFrame + 1
            if npc.StateFrame == 100 then 
                npc:Remove()
            end
        end
	end
end
mod:AddPriorityCallback(ModCallbacks.MC_NPC_UPDATE, -1, mod.Fireup)


function mod:FloodCap(npc)
    if npc.Type == 300 and npc.Variant == 999 then
        if npc:GetSprite():IsFinished("Revealed") then
            --npc.State = NpcState.STATE_IDLE
            npc:GetSprite():Play("Hide", true)
        end
        if npc:GetSprite():IsEventTriggered("Shoot") then
            sound:Play(SoundEffect.SOUND_TEARS_FIRE, 1, 0, false, 1)
            local size = rng:RandomInt(41)/30 + 0.25
            local roll = rng:RandomInt(31) - 15
            local roll2 = rng:RandomInt(31) - 15 + 90
            local roll3 = rng:RandomInt(31) - 15 + 180
            local roll4 = rng:RandomInt(31) - 15 + 270
            local pos = npc.Position
            local params = ProjectileParams()
            params.FallingSpeedModifier = 2
            params.Variant = 4
            params.Scale = size
            npc:FireProjectiles(pos, Vector(5,0):Rotated(roll), 0, params)
            npc:FireProjectiles(pos, Vector(5,0):Rotated(roll2), 0, params)
            npc:FireProjectiles(pos, Vector(5,0):Rotated(roll3), 0, params)
            npc:FireProjectiles(pos, Vector(5,0):Rotated(roll4), 0, params)
        end
    end
end

mod:AddPriorityCallback(ModCallbacks.MC_NPC_UPDATE, -1, mod.FloodCap)



function mod:onBones(npc)
    local params = ProjectileParams()
    params.Variant = 1
    params.HeightModifier = 20
    params.FallingAccelModifier = params.FallingAccelModifier + 0.4
    params.FallingSpeedModifier = params.FallingSpeedModifier - 8
    if npc.Type == 834 and npc.Variant == 2 and npc.SubType == 20 then
        if npc:GetSprite().FlipX == true then
            npc:GetSprite():ReplaceSpritesheet(1, "gfx/monsters/custom/enemy.aged_enraged_boney_flipped.png")
            npc:GetSprite():LoadGraphics()
    end
    if npc:GetSprite().FlipX == false then
        npc:GetSprite():ReplaceSpritesheet(1, "gfx/monsters/custom/enemy.aged_enraged_boney.png")
        npc:GetSprite():LoadGraphics()
    end    
        if npc:GetSprite():IsEventTriggered("Swung") then
            sound:Play(SoundEffect.SOUND_SHELLGAME, 1, 0, false, 1)
        end
        if npc:GetSprite():IsEventTriggered("Shoot") then
            sound:Play(SoundEffect.SOUND_SCAMPER, 1, 0, false, 1)
            local pos = npc.Position
            if npc:GetSprite():IsPlaying("WalkAttackHori") then
                if npc:GetSprite().FlipX == true then
                    npc:FireProjectiles(pos, Vector(12,0):Rotated(180), 0, params)
                else
                    npc:FireProjectiles(pos, Vector(12,0):Rotated(0), 0, params)
                end
            end
            if npc:GetSprite():IsPlaying("WalkAttackUp") then
                npc:FireProjectiles(pos, Vector(12,0):Rotated(270), 0, params)
            end
            if npc:GetSprite():IsPlaying("WalkAttackDown") then
                npc:FireProjectiles(pos, Vector(12,0):Rotated(90), 0, params)
            end
        end
    end
end

mod:AddPriorityCallback(ModCallbacks.MC_NPC_UPDATE, -1, mod.onBones)
Dank = 0
function mod:Glob(npc)
    if npc.Type == 24 and npc.Variant == 1 and npc.SubType == 20 then
        local data = npc:GetData()
        npc.SplatColor = Color(0.2,0.2,0.2,1,0,0,0)
        local pos = npc.Position
        data.Dank = data.Dank + 1
        if npc:GetSprite():IsPlaying("ReGen") then
            if npc:GetSprite():GetFrame() == 0 then
                local params = ProjectileParams()
                local projectiles = fireProjectiles(npc, pos, Vector(10,0), 6, params)
                for i = 1, 4 do
                local projectile = projectiles[i]
                local data = projectile:GetData()
                data.dankshot = true
                end
            end
        end
        if data.Dank == 5 then
            effect = Isaac.Spawn(1000,26,0,pos,Vector(0,0),npc):ToEffect()
            data.Dank = 0
            if npc:GetSprite():IsPlaying("ReGen") then
            effect.Scale = 2
            end
        end
        if npc:IsDead() then
         effect = Isaac.Spawn(1000,26,0,pos,Vector(0,0),npc):ToEffect()
         effect.Scale = 4
        end
    end
end

mod:AddPriorityCallback(ModCallbacks.MC_NPC_UPDATE, -1, mod.Glob)

function mod:Globproj(projectile)
    local data = projectile:GetData()
	if   data.dankshot == true then
        local color = Color(1, 1, 1, 1, 0, 0, 0)
        color:SetColorize(0.5, 0.5, 0.5, 1)
        projectile:GetSprite().Color = color
        --local trail = Isaac.Spawn(1000, 111, 0, Vector(projectile.Position.X, projectile.Position.Y + projectile.Height), Vector(0,0), projectile):ToEffect()
        --trail.Color = Color(0,0,0,1,0,0,0)
        --trail.Scale = 0
    end
end
mod:AddCallback(ModCallbacks.MC_POST_PROJECTILE_UPDATE, mod.Globproj)


function mod:GlobInit(npc)
    if npc.Type == 24 and npc.Variant == 2 and npc.SubType == 20 then
        local data = npc:GetData()
        data.Dank = 0
        --npc:Remove()
        local champ = npc:GetChampionColorIdx()
        local entity = npc:ToNPC():Morph(24, 1, 20, -1)
        if npc:IsChampion() then
            npc:MakeChampion(0, champ, true)
        end
        --Isaac.Spawn(24,1,20,npc.Position,Vector(0,0),npc)
    end
    if npc.Type == 24 and npc.Variant == 1 and npc.SubType == 20 then
        local data = npc:GetData()
        data.Dank = 0
    end
end
mod:AddCallback(ModCallbacks.MC_POST_NPC_INIT, mod.GlobInit)

function mod:Globprespawn(Type,variant,subtype,_,seed)
    if Type == 24 and variant == 1 and subtype == 20 then
        return {24, 1, 20,1, seed}

    end
end
mod:AddCallback(ModCallbacks.MC_PRE_ROOM_ENTITY_SPAWN, mod.Globprespawn)

function mod:Aqua(npc)
    if npc.Type == 825 and npc.Variant == 20 then
        npc.SplatColor = Color(0,0.2,0.4,1,0,0.2,0.4)
        if npc:GetSprite():IsEventTriggered("Fire") then
            sound:Play(SoundEffect.SOUND_WORM_SPIT, 1, 0, false, 1)
			local pos = npc.Position
            local params = ProjectileParams()
            local player = npc:GetPlayerTarget()
            local Rot = (player.Position - npc.Position):GetAngleDegrees()
            local vect = (player.Position - npc.Position)* 0.038
            params.Variant = 4
            --params.BulletFlags = ProjectileFlags.BURST
            params.HeightModifier = -2
            --params.FallingAccelModifier = -0.2
            params.FallingAccelModifier = params.FallingAccelModifier + 0.8
            params.FallingSpeedModifier = params.FallingSpeedModifier - 20
            --params.Scale = 0.8            
            --npc:FireProjectiles(pos, Vector(10,0):Rotated(Rot), 0, params)
            local projectiles = fireProjectiles(npc, pos, vect, 0, params)
            local projectile = projectiles[1]
            local data = projectile:GetData()
            data.cansplit = true
        end
    end
end

mod:AddPriorityCallback(ModCallbacks.MC_NPC_UPDATE, -1, mod.Aqua)

function mod:Aquashot(projectile)
    local pos = projectile.Position
    local data = projectile:GetData()
    if not projectile.SpawnerEntity then
        return
    else
    local npc = projectile.SpawnerEntity:ToNPC()
    if not npc then
        return
    end
        if data.cansplit == true then
            local flag = projectile:GetEntityFlags()
            if projectile:IsDead() or not projectile:Exists() then
                for i = 0, 3 do
                    local params = ProjectileParams()
                    params.Variant = 4
                    --params.BulletFlags = ProjectileFlags.BURST
                    --params.FallingAccelModifier = -0.2
                    params.FallingAccelModifier = params.FallingAccelModifier + 2
                    params.FallingSpeedModifier = params.FallingSpeedModifier - 15
                    params.Scale = projectile.Scale/2
                    --local projectiles = fireProjectiles(npc, pos, Vector(10,0):Rotated(90 * i + 45), 0, params)
                    --local proj = projectiles[1]
                    local proj = Isaac.Spawn(9,projectile.Variant,0,pos,Vector(10,0):Rotated(90 * i + 45),projectile):ToProjectile()
                    proj.Height = projectile.Height
                    proj:AddEntityFlags(flag)
                    proj.FallingAccel = proj.FallingAccel + 2
                    proj.FallingSpeed = proj.FallingSpeed - 15
                    if proj:HasEntityFlags(EntityFlag.FLAG_FRIENDLY) then 
                        proj:AddProjectileFlags(ProjectileFlags.CANT_HIT_PLAYER | ProjectileFlags.HIT_ENEMIES)
                    end
            --npc:FireProjectiles(pos, Vector(10,0):Rotated(90 * i + 45), 0, params)
                end
            end
        end
    end
end
mod:AddCallback(ModCallbacks.MC_POST_PROJECTILE_UPDATE, mod.Aquashot)


function mod:Inferno(npc)
    if npc.Type == 825 and npc.Variant == 400 then
        if npc:GetSprite():IsEventTriggered("Fire") then
			local pos = npc.Position
            local params = ProjectileParams()
            local player = npc:GetPlayerTarget()
            local Rot = (player.Position - npc.Position):GetAngleDegrees()
            params.BulletFlags = ProjectileFlags.FIRE_WAVE | ProjectileFlags.EXPLODE | ProjectileFlags.FIRE_WAVE_X | ProjectileFlags.FIRE_SPAWN
            params.Variant = 0
            params.Color = Color(1, 1, 1, 1, 1, 0.30000001192093, 0)
            params.HeightModifier = -2
            params.FallingAccelModifier = params.FallingAccelModifier + 0.25
            params.FallingSpeedModifier = params.FallingSpeedModifier - 5
            params.Scale = 3
            npc:FireProjectiles(pos, Vector(5,0):Rotated(Rot), 0, params)
        end
    end
end

mod:AddPriorityCallback(ModCallbacks.MC_NPC_UPDATE, -1, mod.Inferno)

function mod:onHit(entity, big, chungus, DamageSource)
    local player = Isaac.GetPlayer(rng:RandomInt(game:GetNumPlayers()))
    if entity.Type == 825 and entity.Variant == 400 or  entity.Type == 833 and entity.Variant == 20 then
      if DamageSource.Type == 1000 and DamageSource.Variant == 147 then
        return
      end
    end
  end
      mod:AddCallback(ModCallbacks.MC_ENTITY_TAKE_DMG, mod.onHit)


function mod:Spore(npc)
    if npc.Type == 30 and npc.Variant == 100 then
        if npc:GetSprite():IsEventTriggered("Spore") then
            local roll = rng:RandomInt(360)
			local pos = npc.Position
            local params = ProjectileParams()
            local player = npc:GetPlayerTarget()
            local Rot = (player.Position - npc.Position):GetAngleDegrees()
            effect = Isaac.Spawn(1000,141,0,pos,Vector(20,0):Rotated(Rot),npc):ToEffect()
            effect:SetTimeout(100)
            effect.Scale = 0.25
        end
    end
end

mod:AddPriorityCallback(ModCallbacks.MC_NPC_UPDATE, -1, mod.Spore)

function mod:Spore2(npc)
    if npc.Type == 88 and npc.Variant == 100 then
        if npc:GetSprite():IsEventTriggered("Spore") then
            local roll = rng:RandomInt(360)
			local pos = npc.Position
            local params = ProjectileParams()
            local player = npc:GetPlayerTarget()
            local Rot = (player.Position - npc.Position):GetAngleDegrees()
            effect = Isaac.Spawn(1000,141,0,pos,Vector(20,0):Rotated(Rot),npc):ToEffect()
            effect:SetTimeout(100)
            effect.Scale = 0.25
        end
    end
end

mod:AddPriorityCallback(ModCallbacks.MC_NPC_UPDATE, -1, mod.Spore2)


function mod:Drown(npc)
    if npc.Type == 87 and npc.Variant == 400 then
        npc.SplatColor = Color(1,1,1,1,0,0,0.0)
        if npc:GetSprite():IsEventTriggered("Fire") then
            sound:Play(SoundEffect.SOUND_HEARTOUT, 1, 0, false, 1)
			local pos = npc.Position
            local params = ProjectileParams()
            local player = npc:GetPlayerTarget()
            local pos2 = player.Position
            local Rot = (player.Position - npc.Position):GetAngleDegrees()
            local roll = rng:RandomInt(7)
            params.Variant = 4
            npc:FireBossProjectiles(4 + roll, pos2, 2, params)
        end
    end
end

mod:AddPriorityCallback(ModCallbacks.MC_NPC_UPDATE, -1, mod.Drown)

function mod:onUpdateProjectile(projectile)
    local pos = projectile.Position
    local player = Isaac.GetPlayer(rng:RandomInt(game:GetNumPlayers()))
	if projectile.SpawnerType == 838 and projectile.SpawnerVariant == 20 or projectile.SpawnerType == 808 and projectile.SpawnerVariant == 20 then
		projectile:AddProjectileFlags(ProjectileFlags.SMART)
	end
end
mod:AddCallback(ModCallbacks.MC_POST_PROJECTILE_UPDATE, mod.onUpdateProjectile)

function mod:onUpdateProjectile2(projectile)
    local pos = projectile.Position
    local player = Isaac.GetPlayer(rng:RandomInt(game:GetNumPlayers()))
    if projectile.SpawnerType == nil and projectile.SpawnerVariant == nil then
        return
    end
	if projectile.SpawnerType == 838 and projectile.SpawnerVariant == 20 or projectile.SpawnerType == 808 and projectile.SpawnerVariant == 20 then
		projectile:AddProjectileFlags(ProjectileFlags.SMART)
    end    
end
mod:AddCallback(ModCallbacks.MC_POST_PROJECTILE_INIT, mod.onUpdateProjectile2)

function mod:pillo(npc)
    if npc.Type == 838 and npc.Variant == 20 then
        local pos = npc.Position
        local target = npc:GetPlayerTarget()
        effect = Isaac.Spawn(1000,166,0,pos,Vector(0,0),npc):ToEffect()
        local tears = Isaac.FindInRadius(pos, 90, EntityPartition.TEAR)
        for _, tear in pairs(tears) do
            if tear.Type == 2 then
                    local rot = (tear.Position - npc.Position):GetAngleDegrees()
                    local FRICTION = 0.8
                    local YOUR_SPEED = 12
                    --npc.Velocity = Vector(0,0)
                    --npc.Velocity = npc.Velocity * FRICTION + (tear.Position - npc.Position):Resized(YOUR_SPEED)
                    --npc.Position = tear.Position
                    --tear:Kill()
            end
        end
    end
end

mod:AddCallback(ModCallbacks.MC_NPC_UPDATE, mod.pillo)

function mod:pillo_Init(npc)
    if npc.Type == 838 and npc.Variant == 20 then
        local pos = npc.Position
        effect = Isaac.Spawn(1000,166,0,pos,npc.Velocity,npc):ToEffect()
    end
end

mod:AddCallback(ModCallbacks.MC_POST_NPC_INIT, mod.pillo_Init)


function mod:fullo(npc)
    if npc.Type == 838 and npc.Variant == 22 then
        local pos = npc.Position
        --print(npc.I2)
        local params = ProjectileParams()
        params.Color = Color(0,1,1,1,0.5,0.6,0.9)
        params.HeightModifier = 1
        params.Scale = 1.25
        params.FallingAccelModifier = 0.5
        params.FallingSpeedModifier = -5.5
        if npc:GetSprite():IsEventTriggered("Fire") then
            sound:Play(SoundEffect.SOUND_TEARS_FIRE, 1, 0, false, 1)
            npc:FireProjectiles(pos, Vector(10,8), 9, params)
        end
    end
end

mod:AddCallback(ModCallbacks.MC_NPC_UPDATE, mod.fullo)

function mod:rillo(npc)
    if npc.Type == 838 and npc.Variant == 21 then
        local pos = npc.Position
        local target = npc:GetPlayerTarget()
        local rot = (target.Position - npc.Position):GetAngleDegrees()
        local params = ProjectileParams()
        params.Spread = 0.25
        params.Color = Color(1, 1 , 1, 1, 0.8, 0, 0)
        if npc:GetSprite():IsEventTriggered("Fire") then
            sound:Play(SoundEffect.SOUND_TEARS_FIRE, 1, 0, false, 1)
            npc:FireProjectiles(pos, Vector(10,0):Rotated(rot), 5, params)
        end
    end
end

mod:AddCallback(ModCallbacks.MC_NPC_UPDATE, mod.rillo)


function mod:Danker(npc)
    if npc.Variant == Donk then
        local data = npc:GetData()
        local player = npc:GetPlayerTarget()
        local vect = (player.Position - npc.Position) * 0.038
        local pos = npc.Position
        local params = ProjectileParams()
        local Rot = (player.Position - npc.Position):GetAngleDegrees()
        --rng:SetSeed(npc.InitSeed, 35)
        if npc:GetSprite():IsFinished("Appear") then
            npc:GetSprite():Play("Walk", true)
            npc.State = NpcState.STATE_MOVE
        end
        if npc:GetSprite():IsPlaying("Appear") then
            npc.State = NpcState.STATE_APPEAR
        end
        if npc:GetSprite():IsPlaying("Jump") then
            npc.State = NpcState.STATE_ATTACK
        end
        if npc:GetSprite():IsPlaying("Walk") then
            npc.State = NpcState.STATE_MOVE
        end
        if npc.State == NpcState.STATE_MOVE then
            data.Dank = data.Dank + 1
            if data.Dank == 5 then
                effect = Isaac.Spawn(1000,26,0,pos,Vector(0,0),npc):ToEffect()
            data.Dank = 0
            end
            local FRICTION = 0.8
            local YOUR_SPEED = 2.5
            runToTarget(npc, nil, YOUR_SPEED) 
            if mod.IsPositionOnScreen(pos) then
                if npc:HasEntityFlags(EntityFlag.FLAG_FEAR) or npc:HasEntityFlags(EntityFlag.FLAG_CONFUSION) or npc:HasEntityFlags(EntityFlag.FLAG_FREEZE) then
                    npc.StateFrame = npc.StateFrame
                else
                     npc.StateFrame = npc.StateFrame + 1
                end
            end
        end
        if npc.StateFrame >= 60 + rng:RandomInt(21) then
            npc:GetSprite():Play("Jump", true)
            npc.Velocity = Vector(0,0)
            npc.StateFrame = 0
        end
        if npc:GetSprite():IsFinished("Jump") then
            sound:Play(SoundEffect.SOUND_FETUS_LAND, 1, 0, false, 1)
            npc:GetSprite():Play("Walk", true)
            npc.State = NpcState.STATE_MOVE
        end
        if npc:GetSprite():IsEventTriggered("Land") then
            --sound:Play(SoundEffect.SOUND_TEARIMPACTS, 1, 0, false, 1)
            for i = 0, 7 do
                effect = Isaac.Spawn(1000,26,0,pos - (Vector(17,0):Rotated(i * 45)),Vector(0,0),npc):ToEffect()
            end
        end
        npc.SplatColor = Color(0.2,0.2,0.2,1,0,0,0)
        if npc:GetSprite():IsEventTriggered("Shoot") then
            sound:Play(SoundEffect.SOUND_WORM_SPIT, 1, 0, false, 1)
            if not npc:HasEntityFlags(EntityFlag.FLAG_FEAR) or not npc:HasEntityFlags(EntityFlag.FLAG_CONFUSION) then
                params.BulletFlags = ProjectileFlags.BURST
                params.Variant = 0
                params.Color = Color(0.1, 0.1, 0.1, 1, 0, 0, 0)
                params.HeightModifier = -2
                params.FallingAccelModifier = params.FallingAccelModifier + 0.25
                params.FallingSpeedModifier = params.FallingSpeedModifier - 7.5
                params.Scale = 1.25
                npc:FireProjectiles(pos, vect, 0, params)
            end
        end
    end
end
    mod:AddPriorityCallback(ModCallbacks.MC_NPC_UPDATE, -1, mod.Danker, one_hundred_and_nine )
function mod:DankerInit(npc)
    if npc.Variant == Donk then
        npc:GetSprite():Play("Walk", true)
        local data = npc:GetData()
        data.Dank = 0
    end
end
mod:AddCallback(ModCallbacks.MC_POST_NPC_INIT, mod.DankerInit, one_hundred_and_nine)
function mod:anker(npc, big, chungus, DamageSource)
    if npc.Variant == HangDonk then

        if npc:GetSprite():IsPlaying("Fall") then
            return
    end
end
end
      mod:AddCallback(ModCallbacks.MC_ENTITY_TAKE_DMG, mod.anker , one_hundred_and_nine)

function mod:DankerInit2(npc)
    if npc.Variant == HangDonk then
        local data = npc:GetData()
        data.Dank2 = true
    end
end
mod:AddCallback(ModCallbacks.MC_POST_NPC_INIT, mod.DankerInit2,one_hundred_and_nine)
function mod:Danker2(npc)
    if npc.Variant == HangDonk then
        --rng:SetSeed(npc.InitSeed, 35)
        local pos = npc.Position
        local params = ProjectileParams()
        local player = npc:GetPlayerTarget()
        local champ = npc:GetChampionColorIdx()
        local pos2 = player.Position
        local Rot = (player.Position - npc.Position):GetAngleDegrees()
        local data = npc:GetData()
        ----print(npc.StateFrame)
        if data.Dank2 == true then
            data.Dank2 = false
            npc:GetSprite():Play("Head01", true)
        end
        if npc:GetSprite():IsPlaying("AttackHead01") then
            npc.State = NpcState.STATE_ATTACK
        end
        if npc:GetSprite():IsPlaying("Head01") then
            npc.State = NpcState.STATE_MOVE
        end
        npc.SplatColor = Color(0.2,0.2,0.2,1,0,0,0)
        if npc.State == NpcState.STATE_MOVE then
            local FRICTION = 0.8
            local YOUR_SPEED = 4
            runToTarget(npc, nil, YOUR_SPEED)
            if not npc:GetSprite():IsPlaying("Fall") then
                if mod.IsPositionOnScreen(pos) then
                    if npc:HasEntityFlags(EntityFlag.FLAG_FEAR) or npc:HasEntityFlags(EntityFlag.FLAG_CONFUSION) or npc:HasEntityFlags(EntityFlag.FLAG_FREEZE) then
                        npc.StateFrame = npc.StateFrame
                    else
                        npc.StateFrame = npc.StateFrame + 1
                end
            end
            end
        end
        if npc.StateFrame >= 60  + rng:RandomInt(21) then
            npc:GetSprite():Play("AttackHead01", true)
            npc.Velocity = Vector(0,0)
            npc.StateFrame = 0
        end
        if npc:GetSprite():IsFinished("AttackHead01") then
            npc:GetSprite():Play("Head01", true)
            npc.State = NpcState.STATE_MOVE
        end 
        local roc = room:GetGridCollisionAtPos(pos)
        --print(roc)
        if npc:GetSprite():IsFinished("Fall") then
            if roc == GridCollisionClass.COLLISION_PIT then
            sound:Play(SoundEffect.SOUND_DEATH_BURST_LARGE, 1, 0, false, 1)

                npc:Kill()
            else
                sound:Play(SoundEffect.SOUND_FETUS_LAND, 1, 0, false, 1)
            
            npc:Remove()
                for i = 0, 7 do
                    effect = Isaac.Spawn(1000,26,0,pos - (Vector(17,0):Rotated(i * 45)),Vector(0,0),npc):ToEffect()
                end
                local champ = npc:GetChampionColorIdx()
                local entity = Isaac.Spawn(one_hundred_and_nine,5,0,pos,Vector(0,0),npc):ToNPC()
                if npc:IsChampion() then
                entity:MakeChampion(0, champ, true)
                end
            end
        end
       
        
        if npc:GetSprite():IsEventTriggered("Fire") then
            sound:Play(SoundEffect.SOUND_WORM_SPIT, 1, 0, false, 1)
            if not npc:HasEntityFlags(EntityFlag.FLAG_CONFUSION) or not npc:HasEntityFlags(EntityFlag.FLAG_FEAR) then
                params.Variant = 0
                --params.Color = Color(0.1, 0.1, 0.1, 1, 0, 0, 0)
                params.HeightModifier = -2
                params.FallingAccelModifier = params.FallingAccelModifier + 0.
                params.FallingSpeedModifier = params.FallingSpeedModifier - 5
                params.Scale = 1.25
                local roll = rng:RandomInt(21)/20  - 0.75
                local roll2 = rng:RandomInt(6)
                params.Scale = 0.80
                params.VelocityMulti = 0.75
                npc:FireBossProjectiles(5 + roll2, pos2, 1, params)
            end
        end
    end
end

mod:AddPriorityCallback(ModCallbacks.MC_NPC_UPDATE, -1, mod.Danker2, one_hundred_and_nine)

function mod:Dankerproj(projectile)
    local pos = projectile.Position
    local player = Isaac.GetPlayer(rng:RandomInt(game:GetNumPlayers()))
    if projectile.SpawnerType == nil and projectile.SpawnerVariant == nil then
        return
    end
    if projectile.SpawnerType == one_hundred_and_nine then 
	if projectile.SpawnerVariant == HangDonk or projectile.SpawnerVariant == Donk then
        local pos = projectile.position
        local color = Color(1, 1, 1, 1, 0, 0, 0)
        color:SetColorize(0.5, 0.5, 0.5, 1)
        projectile:GetSprite().Color = color
        --local trail = Isaac.Spawn(1000, 111, 0, Vector(projectile.Position.X, projectile.Position.Y + projectile.Height), Vector(0,0), projectile):ToEffect()
        --trail.Color = Color(0,0,0,1,0,0,0)
        --trail.Scale = 0
    end
    if  projectile.SpawnerVariant == HangDonk then
        if not projectile:Exists() or projectile:IsDead() then
            local pos = projectile.Position
            effect = Isaac.Spawn(1000,26,0,pos,Vector(0,0),npc):ToEffect()
        end
    end
end    
end
mod:AddCallback(ModCallbacks.MC_POST_PROJECTILE_UPDATE, mod.Dankerproj)


function mod:DankerDeath(npc, damage, chungus, DamageSource)
    if npc.Variant == HangDonk then

        if npc.HitPoints - damage <= 1 then
            npc.GridCollisionClass = EntityGridCollisionClass.GRIDCOLL_NONE
            npc.EntityCollisionClass = EntityCollisionClass.ENTCOLL_NONE
            npc.HitPoints = 1
            sound:Play(SoundEffect.SOUND_MEATY_DEATHS, 1, 0, false, 1)
            npc:GetSprite():Play("Fall", true)
            return
        end
    end
end
mod:AddCallback(ModCallbacks.MC_ENTITY_TAKE_DMG, mod.DankerDeath, one_hundred_and_nine)


function mod:Danker4(npc)
    if npc.SpawnerType == nil and npc.SpawnerVariant == nil or npc.Type == nil then
        return
    end
    if npc.SpawnerType == 90 and npc.SpawnerVariant == 20 or npc.SpawnerType == 90 and npc.SpawnerVariant == 21 or npc.SpawnerType == 90 and npc.SpawnerVariant == 40 then
        if npc.Type == 96 then
            npc:Remove()
        end
    end
    if npc.SpawnerType == 109 then
    if npc.SpawnerVariant == HangDonk then
        if npc.Variant == Donk then
            npc:ClearEntityFlags(EntityFlag.FLAG_APPEAR)
            npc:GetSprite():Play("Appear", true)
            sound:Play(SoundEffect.SOUND_DEATH, 1, 0, false, 1)
        end
    end
    if npc.Variant == Donk then
        npc:AddEntityFlags(EntityFlag.FLAG_NO_PHYSICS_KNOCKBACK)
        npc:AddEntityFlags(EntityFlag.FLAG_NO_KNOCKBACK)
    end
end
end

mod:AddCallback(ModCallbacks.MC_POST_NPC_INIT, mod.Danker4,one_hundred_and_nine)



function mod:Hanger(npc)
    if npc.Type == 90 and npc.Variant == 21 then
        local player = npc:GetPlayerTarget()
        local Rot = (player.Position - npc.Position):GetAngleDegrees()
        local pos = npc.Position
        local data = npc:GetData()
        npc.SplatColor = Color(1,1,1,1,1,1,0)
        if npc:GetSprite():IsPlaying("AttackHead01") or npc:GetSprite():IsPlaying("AttackHead02") or npc:GetSprite():IsPlaying("AttackHead03") or npc:GetSprite():IsPlaying("AttackHead04") then
            if npc:GetSprite():GetFrame() >= 10 and npc:GetSprite():GetFrame() <= 46 then
            npc.EntityCollisionClass = EntityCollisionClass.ENTCOLL_NONE
        else
            npc.EntityCollisionClass = EntityCollisionClass.ENTCOLL_ALL
            end
        else
            npc.EntityCollisionClass = EntityCollisionClass.ENTCOLL_ALL
        end
        if npc.State == 8 then
            npc.Velocity = Vector(0,0)
        end
        if npc:GetSprite():IsEventTriggered("Move") then
            data.amount = data.amount + 1
            local YOUR_SPEED = 23
            npc.Velocity = Vector(0,0)
            runToTarget(npc, nil, YOUR_SPEED) 
            if data.amount == 4 then
                data.amount = 0
                local params = ProjectileParams()
                params.BulletFlags = ProjectileFlags.GREED
                --| ProjectileFlags.EXPLODE
                params.Variant = 7
                params.FallingSpeedModifier = 40
                params.FallingAccelModifier = 1.25
                local roll = rng:RandomInt(11)/20 - 0.25
                local roll2 = rng:RandomInt(8)
                params.Scale = 1 + roll
                params.HeightModifier = -300
                --npc:FireBossProjectiles(1, pos, 0, params)
                local projectiles = fireProjectiles(npc, pos, Vector(0,0), 0, params)
                local projectile = projectiles[1]
                local data = projectile:GetData()
                data.randomrot = true
            end
        end
        if npc:GetSprite():IsEventTriggered("Shoot2") then
            sound:Play(SoundEffect.SOUND_ULTRA_GREED_SPIT, 1, 0, false, 2)
            local params = ProjectileParams()
                params.BulletFlags = ProjectileFlags.GREED | ProjectileFlags.EXPLODE
                params.Variant = 7
                params.Scale = 1.3
               -- params.Spread = 1.25
                params.FallingSpeedModifier = 1.5
                --npc:FireBossProjectiles(1, pos, 0, params)
                npc:FireProjectiles(pos, Vector(10,0):Rotated(Rot), 1, params)
        end
        if npc:GetSprite():IsEventTriggered("Sount") then
            sound:Play(SoundEffect.SOUND_ULTRA_GREED_ROAR_1, 2, 0, false, 1)
        end
        if npc:GetSprite():IsEventTriggered("Sount2") then
            sound:Play(SoundEffect.SOUND_POT_BREAK, 2, 0, false, 1)
        end
        if npc:GetSprite():IsEventTriggered("Fire") then
            data.amount = 0
            for i = 0, 3 do
            --sound:Play(SoundEffect.SOUND_POT_BREAK, 3, 0, false, 1)
            local effect = Isaac.Spawn(1000,72,2,pos,Vector(3,0),npc):ToEffect()
            effect.Rotation = 90 * i
            effect.Scale = 10
            effect.SizeMulti = Vector(0.75,0.75)
            effect.SpriteScale = Vector(0.75,0.75)
            end
        end
    end
    if npc.type == 96 then
        print(npc.I1)
    end
end

mod:AddPriorityCallback(ModCallbacks.MC_NPC_UPDATE, -1, mod.Hanger)



function mod:Hangershot(projectile)
    local pos = projectile.Position
    local data = projectile:GetData()
        if data.randomrot == true then
            projectile.SpriteRotation = rng:RandomInt(360)
    end
end
mod:AddCallback(ModCallbacks.MC_POST_PROJECTILE_UPDATE, mod.Hangershot)

function mod:Hangershotinit(projectile)
    local pos = projectile.Position
    local data = projectile:GetData()
    if not projectile.SpawnerEntity then
        return
    else
    local npc = projectile.SpawnerEntity:ToNPC()
    if not npc then
        return
    end
        if npc.Type == 90 and npc.Variant == 21 then
            projectile.SpriteRotation = 90 + (rng:RandomInt(30) - 15)
        end
    end
end
mod:AddCallback(ModCallbacks.MC_POST_PROJECTILE_INIT, mod.Hangershotinit)


function mod:Hangerinit(npc)
    if npc.Type == 90 and npc.Variant == 21 then
        local player = npc:GetPlayerTarget()
        local Rot = (player.Position - npc.Position):GetAngleDegrees()
        local pos = npc.Position
        local data = npc:GetData()
        data.amount = 0

            local fly = Isaac.Spawn(96,0,0,pos,Vector(0,-20),npc):ToNPC()
            fly.Parent = npc
    end
end

mod:AddCallback(ModCallbacks.MC_POST_NPC_INIT, mod.Hangerinit)

function mod:Hanger2(effect)
    if effect.SpawnerType == nil and effect.SpawnerVariant == nil or effect.Type == nil and effect.Variant == nil then
        return
    end
    if effect.SpawnerType == 90 and effect.SpawnerVariant == 21 then
        if effect.Type == 1000 and effect.Variant == 7 then
            effect.Visible = false
            effect:Remove()
        end
    end
end

mod:AddCallback(ModCallbacks.MC_POST_EFFECT_INIT, mod.Hanger2)


function mod:vessel(effect)
    if effect.SpawnerType == nil and effect.SpawnerVariant == nil or effect.Type == nil and effect.Variant == nil then
        return
    end
    if effect.SpawnerType == 284 and effect.SpawnerVariant == 40 or effect.SpawnerType == 284 and effect.SpawnerVariant == 50 then
        if effect.Type == 1000 and effect.Variant == 22 then
            effect.Visible = false
            effect:Remove()
        end
    end
end

mod:AddCallback(ModCallbacks.MC_POST_EFFECT_INIT, mod.vessel)


function mod:vessel2(npc)
    local params = ProjectileParams()
    if npc.Type == 284 and npc.Variant == 40 then
        if not npc:GetSprite():IsOverlayPlaying("Attack") then
            npc:GetSprite():PlayOverlay("Head", false)
        end
        if npc.SubType == 1 then
            npc.SplatColor = Color(1,1,1,1,0,0,0)
        else
            npc.SplatColor = Color(0.2,0,0.4,1,0,0,0.2)
        end
        if npc:GetSprite():IsOverlayPlaying("Attack") then
            if npc:GetSprite():GetOverlayFrame() == 4 or npc:GetSprite():GetOverlayFrame() == 6 or npc:GetSprite():GetOverlayFrame() == 8 then
                sound:Play(SoundEffect.SOUND_GHOST_SHOOT, 1, 0, false, 1)
			    local pos = npc.Position
                local player = npc:GetPlayerTarget()
                local Rot = (player.Position - npc.Position):GetAngleDegrees()
                params.Variant = 2
                params.HomingStrength = 0.8
                params.BulletFlags = ProjectileFlags.SMART
                params.Scale = 1.20
                npc:FireProjectiles(pos, Vector(10,0):Rotated(Rot), 0, params)
            end
        end
    end
end

mod:AddCallback(ModCallbacks.MC_NPC_UPDATE, mod.vessel2)

function mod:vessel3(projectile)
    if not projectile.SpawnerEntity then
        return
    elseif projectile.SpawnerEntity.Type == 284 and projectile.SpawnerEntity.Variant == 40 and projectile.SpawnerEntity.SubType == 1 then
         projectile.Color = Color(2, 2, 2, 1, 1, -1, -1)       
    elseif projectile.SpawnerEntity.Type == 284 and projectile.SpawnerEntity.Variant == 40 and projectile.SpawnerEntity.SubType == 0 then
        local color = Color(1, 1, 1, 1, 0, 0, 0)
        color:SetColorize(2, 1, 3, 1)
        projectile:GetSprite().Color = color
    end
end

mod:AddCallback(ModCallbacks.MC_POST_PROJECTILE_UPDATE, mod.vessel3)
function mod:VesselDeath(npc)
    local pos = npc.Position
    if npc.Type == 284 and npc.Variant == 40 then
        local entity = Isaac.Spawn(26,20,npc.SubType,pos,Vector(0,0),npc):ToNpc()
        entity:ClearEntityFlags(EntityFlag.FLAG_APPEAR)
        --entity:GetSprite():Play("Appear", true)
    end
end
mod:AddCallback(ModCallbacks.MC_POST_NPC_DEATH, mod.VesselDeath)
function mod:Soul(npc)
    if npc.Type == 26 and npc.Variant == 20 then
        if npc.SubType == 1 then
            npc.SplatColor = Color(2, 2, 2, 1, 1, -1, -1)
        else
            npc.SplatColor = Color(1,1,1,1,0,0,1)
        end
        local player = npc:GetPlayerTarget()
        local pos2 = player.Position
        if npc:GetSprite():IsEventTriggered("Fire") then
            sound:Play(SoundEffect.SOUND_GHOST_SHOOT, 1, 0, false, 1.5)
            if npc.SubType == 1 then
                local pos = npc.Position
                local params = ProjectileParams()
                local Rot = (player.Position - npc.Position):GetAngleDegrees()
                params.BulletFlags = ProjectileFlags.CURVE_LEFT
                params.HomingStrength = 0
                params.Variant = 0
                params.Scale = 1.5
                params.Color = Color(1,1,1,1,0.5,0,0)
                params.CurvingStrength = 0.025
                params.FallingSpeedModifier = -2
                npc:FireProjectiles(pos, Vector(10,0):Rotated(0), 7, params)
            else
                local pos = npc.Position
                local params = ProjectileParams()
                local Rot = (player.Position - npc.Position):GetAngleDegrees()
                params.BulletFlags = ProjectileFlags.CURVE_LEFT | ProjectileFlags.SMART
                params.HomingStrength = 0
                params.Variant = 0
                params.Scale = 1.5
                params.CurvingStrength = 0.025
                params.FallingSpeedModifier = -2
                npc:FireProjectiles(pos, Vector(10,0):Rotated(0), 7, params)
            end
        end
    end
end

mod:AddCallback(ModCallbacks.MC_NPC_UPDATE, mod.Soul)
hitDist = 40
function mod:Slammer(npc)
    if npc.Variant == chainLink then
        --print("true")
    local player = npc:GetPlayerTarget()
    local count = countShutDoors()
        --print(countShutDoors())
        npc.EntityCollisionClass = EntityCollisionClass.ENTCOLL_NONE
        npc.StateFrame = npc.StateFrame + 1
        if npc.StateFrame == 60 then
            npc:GetSprite():Play("Slam01", false)
        end
        if npc:GetSprite():IsFinished("Slam01") then
            npc:GetSprite():Play("Head01", false)
            npc.StateFrame = 0
        end
        if npc:GetSprite():IsFinished("spawn") then
            npc:GetSprite():Play("Head01", false)
        end
        if npc:GetSprite():IsEventTriggered("Slam") then
            local pos = npc.Position
            npc.EntityCollisionClass = EntityCollisionClass.ENTCOLL_ALL
            local wave = Isaac.Spawn(1000,61,0,pos,Vector(0,0):Rotated(0),npc):ToEffect()
            wave.Timeout = 5
            wave.MinRadius = 30
            wave.MaxRadius = 60
        end
        if npc:GetSprite():IsEventTriggered("Up") then
            npc.EntityCollisionClass = EntityCollisionClass.ENTCOLL_NONE
        end
        if room:IsClear() and count <= 0 and npc:GetSprite():IsPlaying("Head01") then
            npc:GetSprite():Play("ded", false)
            npc.StateFrame = 0
        end
        if npc:GetSprite():IsFinished("ded") then
            npc:Kill()
    end
end
end

mod:AddPriorityCallback(ModCallbacks.MC_NPC_UPDATE, -3, mod.Slammer, one_hundred_and_nine)

function mod:Slammer2(npc, big, chungus, DamageSource)
    if npc.Variant == chainLink then

    return
    end
end
mod:AddCallback(ModCallbacks.MC_ENTITY_TAKE_DMG, mod.Slammer2, one_hundred_and_nine)

function mod:Slammer3(npc)
    if npc.Variant == chainLink then
--print("true")
        npc:GetSprite():Play("spawn", false)
        npc:ClearEntityFlags(EntityFlag.FLAG_APPEAR)
        npc:AddEntityFlags(EntityFlag.FLAG_NO_PHYSICS_KNOCKBACK)
        npc:AddEntityFlags(EntityFlag.FLAG_NO_KNOCKBACK)
end
end
mod:AddCallback(ModCallbacks.MC_POST_NPC_INIT, mod.Slammer3,one_hundred_and_nine)
TheHolyOne = { Speed = 1}


function mod:MiniBossDeatha(npc)
    local pos = npc.Position
    local boss = Isaac.CountEntities(nil, one_hundred_and_nine, Holl,0)
    local boss2 = Isaac.CountEntities(nil, one_hundred_and_nine, Camilloa,0)
    local spawnloc = Isaac.GetFreeNearPosition(pos, 0)
    local FuckOffUltraGreedYourModeIsShit = game:IsGreedMode()
    local rngpoggers = getRandomInt(1, 2, rng)
    local rune = Game():GetItemPool():GetCard(getRandomSeed(), false, true, true)
    if not FuckOffUltraGreedYourModeIsShit then
        if npc.Type == Holl and boss == 1 then
            if rngpoggers == 1 then
                Isaac.Spawn(5,300,rune,spawnloc,Vector(0,0),npc)
            end
            if rngpoggers == 2 then
                Isaac.Spawn(5,100,160,spawnloc,Vector(0,0),npc)
            end
        end
        if npc.Type == Camilloa and boss2 == 1 then
            if rngpoggers == 1 then
                Isaac.Spawn(5,300,rune,spawnloc,Vector(0,0),npc)
            end
            if rngpoggers == 2 then
                Isaac.Spawn(5,100,68,spawnloc,Vector(0,0),npc)
            end
        end
    end
end
mod:AddCallback(ModCallbacks.MC_POST_ENTITY_KILL, mod.MiniBossDeatha, one_hundred_and_nine)

function mod:Angel(npc)
    if npc.Variant == Holl then
    local player = npc:GetPlayerTarget()
    local target = npc:GetPlayerTarget()
        local YOUR_SPEED = 2.2
        local FRICTION = 0.8 -- 0.8 or 0.9 tends to work well
        local pos = npc.Position
        if npc:GetSprite():IsPlaying("Spinning") then
            YOUR_SPEED = 5
            runToTarget(npc, nil, YOUR_SPEED)
        end
        if npc:GetSprite():IsPlaying("Idle") then
            runToTarget(npc, nil, YOUR_SPEED)
        end
        npc.Pathfinder:HasPathToPos(target.Position, true)
        if npc.StateFrame == 60 and mod.IsPositionOnScreen(pos) then
            npc:GetSprite():Play("Spinning", false)
        end
        if npc:GetSprite():IsFinished("Spinning") then
            local roll = rng:RandomInt(3) + 1
            if mod.IsPositionOnScreen(pos) then
                roll = rng:RandomInt(4) + 1
            end
            if roll == 1 then
                npc:GetSprite():Play("Attack1", false)
                npc.StateFrame = 0
            elseif roll == 2 then
                npc:GetSprite():Play("Attack2", false)
                npc.StateFrame = 0
            elseif roll == 4 then
                npc:GetSprite():Play("Attack3", false)
                npc.StateFrame = 0
            elseif roll == 3 then
                npc:GetSprite():Play("Attack4", false)
                npc.StateFrame = 0
            end
        end
        if npc:GetSprite():IsFinished("Attack1") or npc:GetSprite():IsFinished("Attack2") or npc:GetSprite():IsFinished("Attack3") or npc:GetSprite():IsFinished("Attack4") then
            npc:GetSprite():Play("Idle", false)
        end
        if npc:GetSprite():IsEventTriggered("SPEEN") then
            sound:Play(SoundEffect.SOUND_DOGMA_RING_START, 1, 0, false, 2)
        end
        if npc:GetSprite():IsEventTriggered("Shoot") then
            sound:Play(SoundEffect.SOUND_TEARS_FIRE, 1, 0, false, 1)
            local params = ProjectileParams()
            params.BulletFlags = ProjectileFlags.SMART
            params.HomingStrength = 1
            params.Variant = 0
            params.Scale = 1.5
            params.FallingSpeedModifier = -2
            npc:FireProjectiles(pos, Vector(10,0):Rotated(0), 7, params)
        end
        if npc:GetSprite():IsEventTriggered("Shoot2") then
            for i = 0, 8 do
                Isaac.Spawn(1000,19,0,pos + Vector(110,0):Rotated(45 * i),Vector(0,0),npc)
            end
        end
        if npc:GetSprite():IsEventTriggered("Fire") then
            for i = 0, 8 do
                Isaac.Spawn(1000,19,0,pos + Vector(65,0):Rotated(45 * i),Vector(0,0),npc)
            end
        end
        if npc:GetSprite():IsEventTriggered("Laser") then
            for i = 0, 4 do
                local laser = EntityLaser.ShootAngle(5, pos, 90 * i, 7,Vector(0,0), npc):ToLaser()
                laser:SetActiveRotation(10, 90, 3, 10)
                laser.PositionOffset = Vector(0,-35)
                laser.DepthOffset = 100
            end
        end
        if npc:GetSprite():IsEventTriggered("pee") then
            sound:Play(SoundEffect.SOUND_THUMBS_DOWN, 1, 0, false, 1)
            local params = ProjectileParams()
            params.BulletFlags = ProjectileFlags.CURVE_LEFT
            params.Variant = 4
            params.Scale = 1.1
            npc:FireProjectiles(pos, Vector(10,0):Rotated(0), 8, params)
        end
        if npc:GetSprite():IsPlaying("Idle") or npc:GetSprite():IsPlaying("Spinning") then
            if mod.IsPositionOnScreen(pos) then
                npc.StateFrame = npc.StateFrame + 1
            end
            npc.Friction = 1
        else
            npc.StateFrame = 0
            npc.Friction = 0
        end
    end
end

mod:AddPriorityCallback(ModCallbacks.MC_NPC_UPDATE, -1, mod.Angel, one_hundred_and_nine)

function mod:Angel2(npc)
    if npc.Variant == nil then
        return
    end
    if npc.Variant == Holl then
        npc:GetSprite():Play("Idle", false)
    end
end

mod:AddCallback(ModCallbacks.MC_POST_NPC_INIT, mod.Angel2, one_hundred_and_nine)

function mod:Bullet(projectile)
    if projectile.Type == 9 and projectile.Variant == 240 then
        projectile:GetSprite():Play("RegularTear6", false)
    end
end
mod:AddCallback(ModCallbacks.MC_POST_PROJECTILE_INIT, mod.Bullet)

function mod:Heads(projectile)
    if projectile.Type == 9 and projectile.Variant == 241 then
        projectile:GetSprite():Play("Idle", true)
    end
end
mod:AddCallback(ModCallbacks.MC_POST_PROJECTILE_INIT, mod.Heads)

function mod:Bullet2(projectile)
    if projectile.Type == 9 and projectile.Variant == 240 then
        if projectile.Height >= -5 or projectile:CollidesWithGrid() or projectile:IsDead() then
            local pos = projectile.Position
            Isaac.Spawn(1000,11,1,pos,Vector(0,0),projectile)
        end
    end
end
mod:AddCallback(ModCallbacks.MC_POST_PROJECTILE_UPDATE, mod.Bullet2)

function mod:HeadShot(shot)
    local pos = shot.Position
    local player = Isaac.GetPlayer(rng:RandomInt(game:GetNumPlayers()))
    if shot.Type == 9 and shot.Variant == 241 then
        if shot:GetSprite():IsEventTriggered("shoot1") then
            local projectile = Isaac.Spawn(9,0,0,pos,Vector(0,10),shot):ToProjectile()
            projectile.Height = shot.Height
            projectile.FallingAccel = 2
        end
        if shot:GetSprite():IsEventTriggered("shoot3") then
            local projectile = Isaac.Spawn(9,0,0,pos,Vector(0,-10),shot):ToProjectile()
            projectile.Height = shot.Height
            projectile.FallingAccel = 2
        end
        if shot:GetSprite():IsEventTriggered("shoot2") then
            local projectile = Isaac.Spawn(9,0,0,pos,Vector(-10,0),shot):ToProjectile()
            projectile.Height = shot.Height
            projectile.FallingAccel = 2
        end
        if shot:GetSprite():IsEventTriggered("shoot4") then
            local projectile = Isaac.Spawn(9,0,0,pos,Vector(10,0),shot):ToProjectile()
            projectile.Height = shot.Height
            projectile.FallingAccel = 2
        end
	end
end
mod:AddCallback(ModCallbacks.MC_POST_PROJECTILE_UPDATE, mod.HeadShot)
function mod:Blight(npc)
    local target = npc:GetPlayerTarget()
    if npc.Variant == Blighted then
        local FRICTION = 0.8 -- 0.8 or 0.9 tends to work well
        local YOUR_SPEED = 4.5
        local pos = npc.Position
        if mod.IsPositionOnScreen(pos) then
            npc.StateFrame = npc.StateFrame + 1
        end
        --print(npc.StateFrame)
        local player = npc:GetPlayerTarget()
        npc:AnimWalkFrame("WalkHori", "WalkVert", 0.1)
        if npc.StateFrame == 60 then
            npc:GetSprite():PlayOverlay("Enraged", true)
        end
        if not npc:GetSprite():IsOverlayPlaying("Enraged") then
            npc:GetSprite():PlayOverlay("Head", true)
            npc.Pathfinder:MoveRandomly()
        end
        if npc:GetSprite():IsOverlayFinished("Enraged") then
            npc.StateFrame = 0
            npc:GetSprite():PlayOverlay("Head", true)
        end
        if npc:GetSprite():IsOverlayPlaying("Enraged") then
            npc.StateFrame = 0
            if npc:GetSprite():GetOverlayFrame() == 1 then
                sound:Play(SoundEffect.SOUND_GHOST_SHOOT, 1, 0, false, 0.5)
            end
            if npc:GetSprite():GetOverlayFrame() == 7 or npc:GetSprite():GetOverlayFrame() == 9 or npc:GetSprite():GetOverlayFrame() == 11 or npc:GetSprite():GetOverlayFrame() == 13 then
                sound:Play(SoundEffect.SOUND_GRROOWL, 1, 0, false, 1)
                sound:Play(SoundEffect.SOUND_GHOST_SHOOT, 1, 0, false, 1)
                local params = ProjectileParams()
                local Rot = (target.Position - npc.Position):GetAngleDegrees()
               -- params.BulletFlags = ProjectileFlags.WIGGLE
                params.Variant = 0
                npc:FireProjectiles(pos, Vector(10,0):Rotated(Rot), 2, params)
            end 
            runToTarget(npc, nil, YOUR_SPEED) 
        end
    end
end
mod:AddPriorityCallback(ModCallbacks.MC_NPC_UPDATE, -1, mod.Blight, one_hundred_and_nine)


function mod:Imp_Init(npc)
    if npc.Variant == Sealed then
        local data = npc:GetData()
        data.playerpos = Vector(0,0)
        data.phase = 0
        data.hitcooldown = 0
        data.hits = npc.HitPoints/5
        data.Attack = 0
    end
end
mod:AddCallback(ModCallbacks.MC_POST_NPC_INIT, mod.Imp_Init, one_hundred_and_nine)

function mod:Imp(npc)
    if npc.Variant == Sealed then
        local player = npc:GetPlayerTarget()
        local FRICTION = 0.8 -- 0.8 or 0.9 tends to work well
        local YOUR_SPEED = 1.5
        local pos = npc.Position
        local data = npc:GetData()
        local rot = (data.playerpos - npc.Position):GetAngleDegrees()
        local dist = pos:Distance(player.Position)
        --print(data.Attack)
        if mod.IsPositionOnScreen(pos) then
            if dist <= 180 then
                if npc:HasEntityFlags(EntityFlag.FLAG_FEAR) or npc:HasEntityFlags(EntityFlag.FLAG_CONFUSION) or npc:HasEntityFlags(EntityFlag.FLAG_FREEZE) then
                    data.Attack = data.Attack
                else
                    data.Attack = data.Attack + 1
                end
            end
        end
        if data.phase == 1 then
            YOUR_SPEED = 3.5
        end
        npc:GetSprite():Play("WalkHori", false)
        if pos and player then
            if data.Attack >= 60 and room:CheckLine(pos, player.Position, 0, 1) then
                if data.phase == 0 then
                    --print("tes")
                    npc:GetSprite():PlayOverlay("Enraged", true)
                end
                if data.phase == 1 then
                    --print("tes1")
                    npc:GetSprite():PlayOverlay("Enrage2", true)
                end
                data.playerpos = player.Position
                npc.Velocity = Vector(0,0)
            end
        end
        if data.hitcooldown > 0 then
            data.hitcooldown = data.hitcooldown - 1
        end
        if data.phase == 0 then
            if not npc:GetSprite():IsOverlayPlaying("Enraged") then
                npc:GetSprite().FlipX = false
                npc:GetSprite():PlayOverlay("Head", true)
                runToTarget(npc, nil, YOUR_SPEED) 
            end
        end
        if data.phase == 1 then
            if not npc:GetSprite():IsOverlayPlaying("Enrage2") then
                npc:GetSprite().FlipX = false
                npc:GetSprite():PlayOverlay("Head2", true)
                runToTarget(npc, nil, YOUR_SPEED) 
            end
        end
        if npc:GetSprite():IsOverlayFinished("Enraged") then
            data.Attack = 0
            npc:GetSprite():PlayOverlay("Head", true)
        end
        if npc:GetSprite():IsOverlayFinished("Enrage2") then
            data.Attack = 0
            npc:GetSprite():PlayOverlay("Head2", true)
        end
        if npc:GetSprite():IsOverlayPlaying("Enraged") then
            npc:GetSprite().FlipX = false
            npc.Velocity = lerpVector(npc.Velocity, Vector(0,0) , 0.3)
            data.Attack = 0
            if npc:GetSprite():GetOverlayFrame() == 0 then
                sound:Play(SoundEffect.SOUND_GRROOWL, 1, 0, false, 1)
            end
            if npc:GetSprite():GetOverlayFrame() == 4 then
                sound:Play(SoundEffect.SOUND_FIRE_RUSH, 1, 0, false, 1)
                local params = ProjectileParams()
                local laser = EntityLaser.ShootAngle(2, pos - Vector(0,0), 0, 8,Vector(0,-30), npc):ToLaser()
                laser.DepthOffset = 300
                --laser:AddTearFlags(TearFlags.TEAR_WAIT)
                laser.Angle = rot
                laser.Parent = npc
                laser.Radius = 50
                laser.Shrink = true
                laser.FirstUpdate = true
            end
        end
        if npc:GetSprite():IsOverlayPlaying("Enrage2") then
            npc:GetSprite().FlipX = false
            npc.Velocity = lerpVector(npc.Velocity, Vector(0,0) , 0.3)
            data.Attack = 0
            if npc:GetSprite():GetOverlayFrame() == 0 then
                sound:Play(SoundEffect.SOUND_GRROOWL, 1, 0, false, 1)
            end
            if npc:GetSprite():GetOverlayFrame() == 4 then
                sound:Play(SoundEffect.SOUND_FIRE_RUSH, 1, 0, false, 1)
                local params = ProjectileParams()
                local laser = EntityLaser.ShootAngle(1, pos - Vector(0,0), 0, 26,Vector(0,-30), npc):ToLaser()
                laser.DepthOffset = 100
                --laser:AddTearFlags(TearFlags.TEAR_WAIT)
                laser.Angle = rot
                laser.SubType = 3
                laser.Variant = 1
                laser.Parent = npc
                laser.Radius = 50
                laser.Shrink = false
                laser.FirstUpdate = true
            end
        end
    end
end

mod:AddPriorityCallback(ModCallbacks.MC_NPC_UPDATE, -1, mod.Imp, one_hundred_and_nine)
  

function mod:sealeddamage(npc, damage, Flag, DamageSource)
    local data = npc:GetData()
    if npc.Variant == Sealed then
        local rot = (DamageSource.Position - npc.Position):GetAngleDegrees()
        if data.phase == 0 then
            if data.hitcooldown == 0 then
                npc:SetColor(Color(1,1,1,1,0,0,0.5), 7,0,true,false)
                data.hits = data.hits - 1
                data.hitcooldown = 15
                sound:Play(487, 1, 0, false, 1)
            end
            if data.hits <= 0 then
                sound:Play(SoundEffect.SOUND_ROCK_CRUMBLE, 1, 0, false, 1)
                npc:GetSprite():PlayOverlay("Head2", true)
                data.Attack = 0
                data.phase = 1
            end  
            npc.Velocity = Vector(-3.5,0):Rotated(rot)
            damage = true
            return
        end
    end
end
mod:AddCallback(ModCallbacks.MC_ENTITY_TAKE_DMG, mod.sealeddamage, one_hundred_and_nine)
  
  function mod:boomb(npc)
    if npc.Variant == Bomb then
    local FRICTION = 0.8 -- 0.8 or 0.9 tends to work well
    local target = npc:GetPlayerTarget()
    local pos = npc.Position
    local Rot = (target.Position - npc.Position):GetAngleDegrees()
        local YOUR_SPEED = 4
      runToTarget(npc, nil, YOUR_SPEED)
        if not npc:GetSprite():IsPlaying("Throw") then
            npc:AnimWalkFrame("WalkHori", "WalkVert", 0.1)
        end
        if npc:GetSprite():IsPlaying("Throw") then
            if npc:GetSprite():GetFrame() == 3 then
                sound:Play(SoundEffect.SOUND_BOOK_PAGE_TURN_12, 1, 0, false, 1)
            end
        end
  
        if npc:GetSprite():IsEventTriggered("Bomb") then
            sound:Play(SoundEffect.SOUND_SHELLGAME, 1, 0, false, 1)
            if not npc:HasEntityFlags(EntityFlag.FLAG_FEAR) or not npc:HasEntityFlags(EntityFlag.FLAG_CONFUSION) then
                local bomb = Isaac.Spawn(4,13,0,pos,Vector(15,0):Rotated(Rot),npc):ToBomb()
                bomb.EntityCollisionClass = EntityCollisionClass.ENTCOLL_PLAYERONLY
                bomb:AddEntityFlags(EntityFlag.FLAG_THROWN)
                bomb.PositionOffset = Vector(0, -20)
                --bomb.GridCollisionClass = EntityGridCollisionClass.GRIDCOLL_NOPITS
            end
        end
        if npc.StateFrame >= 60 then
            npc:GetSprite():Play("Throw", true)
            npc.Friction = 0
            npc.StateFrame = 0
        end
        if not npc:GetSprite():IsPlaying("Throw") and mod.IsPositionOnScreen(pos) then
            if npc:HasEntityFlags(EntityFlag.FLAG_FEAR) or npc:HasEntityFlags(EntityFlag.FLAG_CONFUSION) then
                npc.StateFrame = npc.StateFrame
            else
                npc.StateFrame = npc.StateFrame + 1
            end
        end
        if npc:GetSprite():IsPlaying("Throw") then
            npc.Friction = 0
        end
        if npc:GetSprite():IsFinished("Throw") then
            npc:GetSprite():Play("WalkVert", false)
        end
    end
end
    mod:AddPriorityCallback(ModCallbacks.MC_NPC_UPDATE, -1, mod.boomb, one_hundred_and_nine)

  function mod:bombproof(npc, damage, Flag, DamageSource)
    if npc.Variant == Bomb then
        if Flag & DamageFlag.DAMAGE_EXPLOSION ~= 0 then
            --print("true")
            if DamageSource.Entity.Type == EntityType.ENTITY_BOMB then
                --print("tre")
                if DamageSource.Entity.SpawnerEntity.Type == one_hundred_and_nine and  DamageSource.Entity.SpawnerEntity.Variant == Bomb then
                    return
                end
            end
        end
    end
end
mod:AddCallback(ModCallbacks.MC_ENTITY_TAKE_DMG, mod.bombproof, one_hundred_and_nine)
function mod:coaley(npc)
    if npc.Type == 302 and npc.SubType == 1 then
        npc.Velocity = npc.Velocity:Normalized() * 3.5
        local count = countShutDoors()
        if npc:GetSprite():IsPlaying("Pant") and npc:GetSprite():GetFrame() == 19 then
            npc.I1 = 60
            npc.State = 4
            npc:GetSprite():Play("WalkVert",false)
        end
        if npc:GetSprite():IsEventTriggered("Shoot") then
            sound:Play(SoundEffect.SOUND_FIREDEATH_HISS, 1, 0, false, 1)
			local pos = npc.Position
            local params = ProjectileParams()
            params.Variant = 2
            params.FallingSpeedModifier = 2.5
            params.BulletFlags = ProjectileFlags.DECELERATE | ProjectileFlags.CURVE_RIGHT
            npc:FireProjectiles(pos, Vector(10,8):Rotated(0), 9, params)
        end
    end
end

mod:AddPriorityCallback(ModCallbacks.MC_NPC_UPDATE, -2, mod.coaley)

function mod:coaleyint(npc)
    local data = npc:GetData()
    if npc.Type == 302 and npc.SubType == 1 then
        --npc:GetSprite():Play("WalkVert", false)
    end
end
mod:AddCallback(ModCallbacks.MC_POST_NPC_INIT , mod.coaleyint)

function mod:heartPostUpdate(npc, projectile)
    if npc.Type == 92 and npc.Variant == 100 then
        --print(npc.State)
        local data = npc:GetData()
        local player = npc:GetPlayerTarget()
        local playerrot = (player.Position - npc.Position):GetAngleDegrees()
        local FRICTION = 0.8 -- 0.8 or 0.9 tends to work well
        local YOUR_SPEED = 2 
        npc.SplatColor = Color(2, 2, 2, 1, 1, -1, -1)
        if data.broken == true then
            if npc.PositionOffset.Y > -20 then
                npc.State = 4
                local YOUR_SPEED = 3
                runToTarget(npc, nil, YOUR_SPEED) 
                npc.PositionOffset = npc.PositionOffset + Vector(0,-1)
            end
            npc.Velocity = Vector(0,0)
            npc.Velocity = npc.Velocity * FRICTION + (player.Position - npc.Position):Resized(YOUR_SPEED)
            npc.GridCollisionClass = EntityGridCollisionClass.GRIDCOLL_WALLS
            local sprite = npc:GetSprite()
            sprite:ReplaceSpritesheet(0, "gfx/monsters/custom/enemy.vismask_2.png")
            sprite:ReplaceSpritesheet(1, "gfx/bosses/repentance/visage_glow.png")
            sprite:LoadGraphics()
        end
        if npc:GetSprite():IsEventTriggered("Fire") then
            if data.broken == false then
                sound:Play(SoundEffect.SOUND_FIREDEATH_HISS, 1, 0, false, 1)
                sound:Play(SoundEffect.SOUND_BLOODSHOOT, 1, 0, false, 1)
			    local pos = npc.Position
                local params = ProjectileParams()
                params.ChangeTimeout = 45
                 params.BulletFlags =  ProjectileFlags.GHOST
                params.Color = Color(2, 2, 2, 1, 1, -1, -1)
                params.Variant = 2
                params.Scale = 0.25
                for i = 0, 7 do
                local projectiles = fireProjectiles(npc, pos, Vector(7.5,0):Rotated(i * 46), 0, params)
                local projectile = projectiles[1]
                local data = projectile:GetData()
                data.poofshot = true
                end

            end
		    if data.broken == true then
                sound:Play(SoundEffect.SOUND_BLOODSHOOT, 1, 0, false, 1)
                local pos = npc.Position
                for i = 0, 8 do 
                    local rot = 45 * i 
                    local laser = EntityLaser.ShootAngle(2, pos, rot, 7,Vector(0,0), npc):ToLaser()
                    laser.Radius = 100
                    laser:SetMaxDistance(75)
                    laser.PositionOffset = Vector(0,-35)
                    laser.DepthOffset = 200
                end
            end
		end
	end
end
mod:AddPriorityCallback(ModCallbacks.MC_NPC_UPDATE, -1, mod.heartPostUpdate)
function mod:fireproof(npc, damage, Flag, DamageSource)
    if npc.Variant == 100 then
        if DamageSource.Entity.Type == 1000 then
                print("true")
                if DamageSource.Entity.Variant == 147 then
                return
            end
        end
    end
end
mod:AddCallback(ModCallbacks.MC_ENTITY_TAKE_DMG, mod.fireproof, 92)
function mod:visshot(projectile)
    local pos = projectile.Position
    local data = projectile:GetData()
        if data.poofshot == true then
            local flag = projectile:GetEntityFlags()
            projectile.ChangeTimeout = projectile.ChangeTimeout - 1
            projectile.FallingAccel = -0.1
            projectile.FallingSpeed = 0
            projectile.Color = Color(2, 2, 2, 1, 1, -1, -1)
            projectile.Velocity = lerpVector(projectile.Velocity, Vector(0,0) , 0.1)
            projectile.SpriteScale = Vector(0.75,0.75)
            if projectile.ChangeTimeout <= 0 then
                projectile:Die()
            end
        end
end
mod:AddCallback(ModCallbacks.MC_POST_PROJECTILE_UPDATE, mod.visshot)


function mod:visshotinit(projectile)
    local pos = projectile.Position
    local data = projectile:GetData()
    if not projectile.SpawnerEntity then
        return
    else
    local npc = projectile.SpawnerEntity:ToNPC()
    if not npc then
        return
    end
        if npc.Type == 92 and npc.Variant == 100 then
            local flag = projectile:GetEntityFlags()
            projectile.FallingAccel = -0.1
            projectile.FallingSpeed = 0
            projectile.SpriteScale = Vector(0.75,0.75)
            projectile.Color = Color(2, 2, 2, 1, 1, -1, -1)
        end
    end
end
mod:AddCallback(ModCallbacks.MC_POST_PROJECTILE_INIT, mod.visshotinit)

function mod:onUpdateNpc(npc, player, effect)
    if npc.Type == 93 then 
        if npc.Variant == 100 then
           --if npc.PositionOffset.Y <= 0 then
           --     npc.I1 = 0
             --   npc.I2 = 0
            --    npc.Velocity = Vector(0,0)
            --    npc.State = NpcState.STATE_IDLE
            --    npc.PositionOffset = npc.PositionOffset + Vector(0,4)
           -- end 
            if npc.I1 == 1 then
                npc.State = 8
                if npc:GetSprite():IsPlaying("Right") or npc:GetSprite():IsPlaying("Left") then
                    npc.Velocity.Y = 0
                end
                if npc:GetSprite():IsPlaying("Up") or npc:GetSprite():IsPlaying("Down") then
                    npc.Velocity.X = 0
                end
            end
            if npc:CollidesWithGrid() and npc.State == 8 then
                --if npc:GetSprite():IsPlaying("Left") then
               -- local pos = npc.Position
               -- local effect = Isaac.Spawn(1000, 148, 0, pos, Vector(0, 0):Rotated(0), npc):ToEffect()
                --effect.Roatation = 0
                --end
                npc.State = 4
                sound:Play(48, 1, 0, false, 1)
                for i = 0, 3 do
                    local pos = npc.Position
                    local effect = Isaac.Spawn(1000, 148, 0, pos, Vector(0, 0):Rotated(0), npc):ToEffect()
                    effect.Color = Color(2, 2, 2, 1, 1, -1, -1)
                    effect.Rotation = 90 * i
                    effect.MaxRadius = 1
                    effect.Parent = npc
                end
            end
        end
    end
end

mod:AddPriorityCallback(ModCallbacks.MC_NPC_UPDATE, -1, mod.onUpdateNpc)

function mod:Heart_pint(npc)
    local data = npc:GetData()
    if npc.Type == 92 and npc.Variant == 100 then
        data.broken = false
    end
        if npc.Type == 93 and npc.Variant == 100 then
    end	
end
mod:AddCallback(ModCallbacks.MC_POST_NPC_INIT , mod.Heart_pint, EntityType.ENTITY_HEART)

function mod:TookDamage(npc, damageAmount)
    local data = npc:GetData()
    if npc.Type == 92 and npc.Variant == 100 and (npc.HitPoints-damageAmount) <= (npc.MaxHitPoints/2) and data.broken == false then
        sound:Play(SoundEffect.SOUND_ROCK_CRUMBLE, 1, 0, false, 1)
        data.broken = true
    end	
end
mod:AddCallback(ModCallbacks.MC_ENTITY_TAKE_DMG , mod.TookDamage, EntityType.ENTITY_HEART)
function mod:visPostUpdate(npc, parent)
    if npc.Type == 903 and npc.Variant == 20 and npc.SubType == 2 then
        npc.SplatColor = Color(2,2,2,1,1,0.5,0)
       npc.StateFrame = npc.StateFrame + 1
        if npc.StateFrame == 100 then 
            npc:Kill()
        end
    end
end
mod:AddCallback(ModCallbacks.MC_NPC_UPDATE, mod.visPostUpdate)
function mod:Color(effect)
    local myColor = effect.SplatColor
   -- print(myColor.R, myColor.G, myColor.B, myColor.A, myColor.RO, myColor.GO, myColor.BO)
    --print(effect.Variant)
    --print(effect.SubType)
end
mod:AddCallback(ModCallbacks.MC_POST_NPC_INIT, mod.Color)




local C_TARG = Isaac.GetEntityVariantByName("Camillo Target")
function mod:lasershot(projectile)
    local pos = projectile.Position
    local data = projectile:GetData()
        if data.lasershot == true then
            local flag = projectile:GetEntityFlags()
            projectile.ChangeTimeout = projectile.ChangeTimeout - 1
            projectile.FallingAccel = -0.1
            projectile.FallingSpeed = 0
            projectile.Color = Color(2, 2, 2, 1, 1, -1, -1)
            if projectile.ChangeTimeout <= 0 then
                projectile:Remove()
            end
        end
end
mod:AddCallback(ModCallbacks.MC_POST_PROJECTILE_UPDATE, mod.lasershot)

function mod:C_TARGET(effect)
    if effect.Type == nil and effect.Variant == nil then
        return
    end
    if effect.Type == 1000 and effect.Variant == 225 then
        --print(effect.Timeout)
        if effect.Timeout == 0 then
            --effect:ClearEntityFlags(EntityFlag.FLAG_RENDER_FLOOR)
            effect:Remove()
        end
    end
end

mod:AddCallback(ModCallbacks.MC_POST_EFFECT_UPDATE, mod.C_TARGET)
function mod:C_TARGETint(effect)
    if effect.Type == nil and effect.Variant == nil then
        return
    end
    if effect.Type == 1000 and effect.Variant == 198 then
        ----print(effect.LifeSpan)
       -- --print(effect.DepthOffset)
       ----print(effect.Scale)
       --print(effect.TargetPosition)
    end
end

mod:AddCallback(ModCallbacks.MC_POST_EFFECT_UPDATE, mod.C_TARGETint)
function mod:Camillo(npc)
    if npc.Variant == Camilloa then
        --print("true2")
        local target = npc:GetPlayerTarget()
        local data = npc:GetData()
        local pos = npc.Position
        local rot = (target.Position - npc.Position):GetAngleDegrees()
        local FRICTION = 0.8 -- 0.8 or 0.9 tends to work well
        local YOUR_SPEED = 4
        local WaddooCount = Isaac.CountEntities(npc, MiniCamillo, 0, -1)
        local roz = (data.DICK - pos):GetAngleDegrees()
        data.Balls = target.Position
        if npc:GetSprite():IsPlaying("Float") and mod.IsPositionOnScreen(pos) then
            data.IdleTimer = data.IdleTimer + 1
        end
        if not npc:GetSprite():IsPlaying("Float") then
            data.IdleTimer = 0
        end
        if data.IdleTimer == 30 then
            npc:GetSprite():Play("move ready", false)
        end
        if npc:GetSprite():IsEventTriggered("Shoot") then
            sound:Play(SoundEffect.SOUND_TEARS_FIRE, 1, 0, false, 1)
            local params = ProjectileParams()
            params.FallingSpeedModifier = 2.5
            npc:FireProjectiles(pos, Vector(10,8):Rotated(0), 9, params)
        end
        if npc:GetSprite():IsEventTriggered("Airshot") then
            local params = ProjectileParams()
            sound:Play(SoundEffect.SOUND_TEARS_FIRE, 1, 0, false, 1)
            params.HeightModifier = -140
            params.FallingSpeedModifier = 36
            npc:FireProjectiles(pos, Vector(0,0):Rotated(0), 0, params)
        end
        if npc:GetSprite():IsEventTriggered("ready") then
            data.DICK = target.Position
            local effect = Isaac.Spawn(1000,198,0,pos,Vector(0,0),npc):ToEffect()
            effect.TargetPosition = data.DICK - npc.Position
            effect.LifeSpan = 10
            effect.Timeout = 10
            effect.DepthOffset = 99

            effect.Color = Color(1, 1, 1, 1, 1, 0, 0)

        end
        if npc:GetSprite():IsEventTriggered("ready2") then
            --data.DICK = target.Position
            data.DICK = target.Position
        end
        if npc:GetSprite():IsEventTriggered("Down") then
            npc.PositionOffset = npc.PositionOffset + Vector(0,15)
        end
        if npc:GetSprite():IsEventTriggered("laser") then
            local laser = EntityLaser.ShootAngle(1, pos, 0, 10,Vector(0,-30), npc):ToLaser()
            laser.DepthOffset = 100
            --laser:AddTearFlags(TearFlags.TEAR_WAIT)
            laser.Angle = roz
        end
        if npc:GetSprite():IsFinished("move ready") then
            npc:GetSprite():Play("Move", false)
        end
        if npc:GetSprite():IsFinished("Angry") then
            npc:GetSprite():Play("LASER", false)
        end
        if npc:GetSprite():IsFinished("Dash") then
            npc:GetSprite():Play("Beam", false)
        end
        if npc:GetSprite():IsFinished("LASER") or npc:GetSprite():IsFinished("Spit") or npc:GetSprite():IsFinished("Spawn") or npc:GetSprite():IsFinished("Down") or npc:GetSprite():IsFinished("Beam") or npc:GetSprite():IsFinished("Apear") then
            npc.EntityCollisionClass = EntityCollisionClass.ENTCOLL_ALL
            npc:GetSprite():Play("Float", false)
        end
        if npc:GetSprite():IsPlaying("Move") then
            runToTarget(npc, nil, YOUR_SPEED) 
            if mod.IsPositionOnScreen(pos) then
                data.PENIS = data.PENIS + 1
            end
        end
        if npc:GetSprite():IsPlaying("Air attack") then
            YOUR_SPEED = 5.5
            runToTarget(npc, nil, YOUR_SPEED) 
        end
        if npc:GetSprite():IsPlaying("Angry") then
            npc.Velocity = Vector(0,0)
        end
        if npc:GetSprite():IsPlaying("Up") then
            npc.GridCollisionClass = EntityGridCollisionClass.GRIDCOLL_WALLS
            npc.EntityCollisionClass = EntityCollisionClass.ENTCOLL_NONE
            if npc.PositionOffset.Y <= -150 then
                npc:GetSprite():Play("Air attack", false)
            end
            if npc.PositionOffset.Y > -150 then
                npc.PositionOffset = npc.PositionOffset + Vector(0,-5)
            end
        end
        if not npc:GetSprite():IsPlaying("Move") then
            data.PENIS = 0
        end
        if mod.IsPositionOnScreen(pos) and npc:GetSprite():IsPlaying("Air attack") then
            data.Flytimer = data.Flytimer + 1
        end
        if npc:GetSprite():IsPlaying("LASER") then
            npc.Velocity = Vector(0,0)
        end
        if data.Flytimer == 60 then
            npc:GetSprite():Play("Down", false)
            npc.Velocity = Vector(0,0)
            data.Flytimer = 0
        end
        if data.PENIS == 60 then
            local roll = rng:RandomInt(3) + 1
            if WaddooCount < 3 then
                roll = rng:RandomInt(4) + 1
            end
            if roll == 1 then
                npc:GetSprite():Play("Dash", false)
            end
            if roll == 2 then
                npc:GetSprite():Play("Up", false)
            end  
            if roll == 3 then
                npc:GetSprite():Play("Angry", false)
            end   
            if roll == 4 then
                npc:GetSprite():Play("Spawn", false)
            end    
        end
        if npc:GetSprite():IsEventTriggered("Crush") then
            --npc.EntityCollisionClass = EntityCollisionClass.ENTCOLL_ALL
            local effect = Isaac.Spawn(1000,61,0,pos,Vector(0,0),npc):ToEffect()
        end
        if npc:GetSprite():IsEventTriggered("rush") then
            local v1 = Vector(0, 0)
            local v2 = Vector(1, 1)
           -- local larp = (npc.Position:Lerp(player.Position,1)):GetAngleDegrees()
           YOUR_SPEED = 35
           local center = room:GetCenterPos()
           runToTarget(npc, center, YOUR_SPEED) 
        end
        if npc:GetSprite():IsEventTriggered("stop") then
            npc.Velocity = Vector(0,0)
        end
        if npc:GetSprite():IsEventTriggered("Lerp") then
            --npc.Velocity = Vector(0,0)
            --print(npc.Velocity)
            npc.Velocity = lerpVector(npc.Velocity, Vector(0,0) , 0.5)
        end
        if npc:GetSprite():IsEventTriggered("rotset") then
            data.Rotation = 0
        end
        if npc:GetSprite():IsEventTriggered("fire") then
            sound:Play(SoundEffect.SOUND_LASERRING, 1, 0, false, 1)
            local param = ProjectileParams()
            param.FallingAccelModifier = -0.2
            param.Color = Color(2, 2, 2, 1, 1, -1, -1)
            param.Scale = 2.5
            param.Variant = 0
            param.BulletFlags =  ProjectileFlags.GHOST
            param.FallingSpeedModifier = 1.5
            param.ChangeTimeout = 25
            for i = 0, 1 do 
                local projectiles = fireProjectiles(npc,pos, Vector(-10,0):Rotated(data.Rotation + (i*180)), 0, param)
                local projectile = projectiles[1]
                local data = projectile:GetData()
                data.lasershot = true
            end
            data.Rotation = data.Rotation + 15
        end
        if npc:GetSprite():IsEventTriggered("spawn") then
            sound:Play(SoundEffect.SOUND_SUMMONSOUND, 1, 0, false, 1)
            Isaac.Spawn(one_hundred_and_nine, MiniCamillo, 0, pos + Vector(0,20), Vector(0, 0):Rotated(0), npc)
        end
    end
end
mod:AddPriorityCallback(ModCallbacks.MC_NPC_UPDATE, -1, mod.Camillo, one_hundred_and_nine)
function mod:Camillo_Init(npc)
    if npc.Variant == Camilloa then

        --print("true")
        npc:AddEntityFlags(EntityFlag.FLAG_NO_PHYSICS_KNOCKBACK)
        npc:AddEntityFlags(EntityFlag.FLAG_NO_KNOCKBACK)
        npc.GridCollisionClass = EntityGridCollisionClass.GRIDCOLL_WALLS
        local data = npc:GetData()
        data.IdleTimer = 0
        data.PENIS = 0
        data.Flytimer = 0
        data.DICK = Vector(0,0)
        data.Balls = Vector(0,0)
            npc.EntityCollisionClass = EntityCollisionClass.ENTCOLL_NONE
            data.Rotation = 0
        npc:GetSprite():Play("Apear", false)
    end
end
mod:AddCallback(ModCallbacks.MC_POST_NPC_INIT, mod.Camillo_Init, one_hundred_and_nine)


function mod:MiniCamillo(npc)
    if npc.Variant == MiniCamillo then
    local pos = npc.Position
    local player = npc:GetPlayerTarget()
    local data = npc:GetData()
    local dist = pos:Distance(player.Position)
    if npc:GetSprite():IsEventTriggered("Shoot") then
        sound:Play(SoundEffect.SOUND_LASERRING, 1, 0, false, 1)
        local param = ProjectileParams()
        param.FallingAccelModifier = -0.2
        param.Color = Color(2, 2, 2, 1, 1, -1, -1)
        param.Scale = 0.8
        param.Variant = 0
        param.BulletFlags =  ProjectileFlags.GHOST
        param.FallingSpeedModifier = 1.5
        param.ChangeTimeout = 15
        for i = 0, 1 do 
            local projectiles = fireProjectiles(npc,pos, Vector(-10,0):Rotated(data.Rotation + (i*180)), 0, param)
            local projectile = projectiles[1]
            local data = projectile:GetData()
            data.lasershot = true
        end
        data.Rotation = data.Rotation + 22.5
    end
    if npc:GetSprite():IsFinished("Spit") then
        npc.Velocity = Vector(data.X, data.Y)
        data.IdleTimer = 60
        npc:GetSprite():Play("Float", false)
        data.Rotation = 0
    end
    if npc:GetSprite():IsPlaying("Spit") then
        npc.Velocity = Vector(0,0)
    end
    if not npc:GetSprite():IsPlaying("Spit") then
        data.X = npc.Velocity.X
        data.Y = npc.Velocity.Y
        DiagonalMove(npc, 3, thirdboolean, 1)
        npc:GetSprite():Play("Float", false)
        if npc:HasEntityFlags(EntityFlag.FLAG_FEAR) or npc:HasEntityFlags(EntityFlag.FLAG_CONFUSION) or npc:HasEntityFlags(EntityFlag.FLAG_FREEZE) then
            IdleTimer.IdleTimer = data.IdleTimer
        else
        data.IdleTimer = data.IdleTimer - 1
        end
        if mod.IsPositionOnScreen(pos) then
                if dist <= 240 then
                    if npc:HasEntityFlags(EntityFlag.FLAG_FEAR) or npc:HasEntityFlags(EntityFlag.FLAG_CONFUSION) or npc:HasEntityFlags(EntityFlag.FLAG_FREEZE) then
                        elseif data.IdleTimer <= 0 then
                        npc:GetSprite():Play("Spit", false)
                end
            end
        end
    end
    end
end
mod:AddPriorityCallback(ModCallbacks.MC_NPC_UPDATE, -1, mod.MiniCamillo, one_hundred_and_nine)

function mod:MiniCamillo_Init(npc)
    if npc.Variant == MiniCamillo then
    npc:AddEntityFlags(EntityFlag.FLAG_NO_PHYSICS_KNOCKBACK)
    npc:AddEntityFlags(EntityFlag.FLAG_NO_KNOCKBACK)
    npc.GridCollisionClass = EntityGridCollisionClass.GRIDCOLL_WALLS
    local data = npc:GetData()
    data.IdleTimer = 60
    data.Rotation = 0
    data.Rot = 45
    data.X = 0
    data.Y = 0
    npc:GetSprite():Play("Float", false)
    end
end
mod:AddPriorityCallback(ModCallbacks.MC_POST_NPC_INIT, -1, mod.MiniCamillo_Init, one_hundred_and_nine)

function mod:camilloproof(npc, damage, Flag, DamageSource)
    if npc.Variant == Camilloa or npc.Variant == MiniCamillo then
        if DamageSource.Entity.Type == EntityType.ENTITY_LASER then
        if DamageSource.Entity.SpawnerEntity.Type == one_hundred_and_nine and DamageSource.Entity.SpawnerEntity.Variant == Camilloa then
            return
        end
        end
    end
end
mod:AddCallback(ModCallbacks.MC_ENTITY_TAKE_DMG, mod.camilloproof, one_hundred_and_nine)

function mod:Waddoo(npc)
    local pos = npc.Position
    local data = npc:GetData()
    if npc.Type == 284 and npc.Variant == 50 then
        if npc:GetSprite():IsOverlayPlaying("Attack") then
            sound:Play(SoundEffect.SOUND_LASERRING, 1, 0, false, 1)
            local sprite = npc:GetSprite()
            if sprite:GetOverlayFrame() == 5 or sprite:GetOverlayFrame() == 8 or sprite:GetOverlayFrame() == 11 or sprite:GetOverlayFrame() == 14 or sprite:GetOverlayFrame() == 17 or sprite:GetOverlayFrame() == 20 or sprite:GetOverlayFrame() == 23 or sprite:GetOverlayFrame() == 26 or sprite:GetOverlayFrame() == 29 or sprite:GetOverlayFrame() == 32 then
                local param = ProjectileParams()
                param.Color = Color(2, 2, 2, 1, 1, -1, -1)
                param.FallingAccelModifier = -0.2
                param.Scale = 1
                param.Variant = 0
                param.FallingSpeedModifier = 1.5
                data.Rotation = data.Rotation + 18
                param.ChangeTimeout = 15
                param.BulletFlags =  ProjectileFlags.GHOST
                local projectiles = fireProjectiles(npc,pos, Vector(-10,0):Rotated(data.Rotation), 0, param)
                local projectile = projectiles[1]
                local data = projectile:GetData()
                data.lasershot = true
            end
        end
    end
end

mod:AddCallback(ModCallbacks.MC_NPC_UPDATE, mod.Waddoo)

function mod:Waddoo_Init(npc)
    if npc.Type == 284 and npc.Variant == 50 then
        local data = npc:GetData()
        data.Rotation = 0
    end
end
mod:AddCallback(ModCallbacks.MC_POST_NPC_INIT, mod.Waddoo_Init)



function mod:RibFly(npc)
    local pos = npc.Position
    local data = npc:GetData()
    local target = npc:GetPlayerTarget()
    local FRICTION = 0.8 -- 0.8 or 0.9 tends to work well
    local YOUR_SPEED = -20
    local params = ProjectileParams()
    local Rot = (target.Position - npc.Position):GetAngleDegrees()
    if npc.Type == 214 and npc.Variant == 20 then
        npc.V1 = Vector(0.2,0.2)
        local data = npc:GetData()
        if data.Attack == false then
            npc:GetSprite():Play("Move", false)
            npc.I2 = npc.I2 + 1
        end
        if npc:GetSprite():IsFinished("Attack") then
            npc.I2 = 0
            npc:GetSprite():Play("Move", false)
            data.Attack = false
        end
        if npc.I2 >= 60 then
            data.Attack = true

        end
        if data.Attack == true then
            npc.I2 = 0
            npc:GetSprite():Play("Attack", false)
        end
        if npc:GetSprite():IsEventTriggered("Shoot") then
            sound:Play(SoundEffect.SOUND_SCAMPER, 1, 0, false, 1)
            params.Variant = 1
            npc.Velocity = npc.Velocity * FRICTION + (target.Position - npc.Position):Resized(YOUR_SPEED)
            npc:FireProjectiles(pos, Vector(15,0):Rotated(Rot), 0, params)
        end
    end
end

mod:AddPriorityCallback(ModCallbacks.MC_NPC_UPDATE, -1, mod.RibFly)


function mod:RibFlyiny(npc)
    if npc.Type == 214 and npc.Variant == 20 then
        local data = npc:GetData()
        npc:GetSprite():Play("Move", false)
        data.Attack = false
    end
end

mod:AddCallback(ModCallbacks.MC_POST_NPC_INIT, mod.RibFlyiny)


function mod:Thread(npc)
    local pos = npc.Position
    local data = npc:GetData()
    local params = ProjectileParams()
    params.BulletFlags = ProjectileFlags.CHANGE_FLAGS_AFTER_TIMEOUT
    params.ChangeFlags = ProjectileFlags.ANTI_GRAVITY 
    params.ChangeTimeout = 125
    params.Scale = 1.5
    params.Color = Color(1, 1, 1, 1, 0.39999991192093, 0, 0)
    params.FallingAccelModifier = -0.2
    if npc.Type == 881 and npc.Variant == 5 then
        local target = npc:GetPlayerTarget()
        local rot = (target.Position - npc.Position):GetAngleDegrees()
        if npc:GetSprite():IsPlaying("Idle") or npc:GetSprite():IsPlaying("IdleBack") then
            --npc.Velocity = Vector(6,0):Rotated(rot)
            --npc.Friction = 1
            if npc:IsVisible() then
                data.creep = data.creep + 1
                if data.creep == 7 then
                    sound:Play(SoundEffect.SOUND_TEARS_FIRE, 1, 0, false, 1)
                    npc:FireProjectiles(pos, Vector(0,0):Rotated(rot), 0, params)
                    local effect = Isaac.Spawn(1000, 22, 0, pos, Vector(0, 0):Rotated(0), npc):ToEffect()
                    data.creep = 0
                end
            end
            if not npc:IsVisible() then
                data.creep = 0
            end
        end
    end
end
    mod:AddPriorityCallback(ModCallbacks.MC_NPC_UPDATE, -1, mod.Thread)


function mod:Thread_Init(npc)
    if npc.Type == 881 and npc.Variant == 5 then
        local data = npc:GetData()
        data.creep = 0
    end
end
mod:AddCallback(ModCallbacks.MC_POST_NPC_INIT, mod.Thread_Init)

function mod:Maidenshot(projectile)
    if not projectile.SpawnerEntity then
        return
    end
    local npc = projectile.SpawnerEntity:ToNPC()
    if not npc then
        return
    end
    if npc.Type == 321 and npc.Variant == 1 then
        projectile.Height = -25
    end
end
mod:AddCallback(ModCallbacks.MC_POST_PROJECTILE_UPDATE, mod.Maidenshot)

function mod:Maiden(npc)
    if npc.Variant == Maiden then
    local FRICTION = 0.8 -- 0.8 or 0.9 tends to work well
    local YOUR_SPEED = 6 
    local pos = npc.Position
    local data = npc:GetData()
    local params = ProjectileParams()
    local vec = Vector(10,0)
        if data.Maiden == true then
            npc:GetSprite():Play("Hop", true)
            data.Maiden = false
        end
        local target = npc:GetPlayerTarget()
        local rot = (target.Position - npc.Position):GetAngleDegrees()
        if npc:GetSprite():IsEventTriggered("Move") then
            runToTarget(npc, nil, YOUR_SPEED)
        end
        if npc:GetSprite():IsPlaying("Hop") and mod.IsPositionOnScreen(pos) then
            if npc:HasEntityFlags(EntityFlag.FLAG_FEAR) or npc:HasEntityFlags(EntityFlag.FLAG_CONFUSION) or npc:HasEntityFlags(EntityFlag.FLAG_FREEZE) then
                npc.StateFrame = npc.StateFrame
            else
                npc.StateFrame = npc.StateFrame + 1
            end
        end
        if npc:GetSprite():IsEventTriggered("Stop") then
            sound:Play(487, 1, 0, false, 1)
            npc.Velocity = Vector(0,0)
        end
            params.BulletFlags = ProjectileFlags.BOUNCE
            if npc:GetSprite():IsEventTriggered("Attack") then
                if not npc:HasEntityFlags(EntityFlag.FLAG_FEAR) or not npc:HasEntityFlags(EntityFlag.FLAG_CONFUSION) then
                    sound:Play(SoundEffect.SOUND_TEARS_FIRE, 1, 0, false, 1)
                    npc:FireProjectiles(pos, vec, 0, params)
                    npc:FireProjectiles(pos, vec:Rotated(120), 0, params)
                    npc:FireProjectiles(pos, vec:Rotated(240), 0, params)
                end
            end
            if npc:GetSprite():IsEventTriggered("Attack2") then
                if not npc:HasEntityFlags(EntityFlag.FLAG_FEAR) or not npc:HasEntityFlags(EntityFlag.FLAG_CONFUSION) then
                    sound:Play(SoundEffect.SOUND_TEARS_FIRE, 1, 0, false, 1)
                    npc:FireProjectiles(pos, vec:Rotated(60), 0, params)
                    npc:FireProjectiles(pos, vec:Rotated(180), 0, params)
                    npc:FireProjectiles(pos, vec:Rotated(300), 0, params)
                end
            end
            if npc.StateFrame >= 60 and npc:GetSprite():GetFrame() == 19 and npc:GetSprite():IsPlaying("Hop") then
                npc.StateFrame = 0
                npc:GetSprite():Play("Attack", true)
                npc.Velocity = Vector(0,0)
            end
            if npc:GetSprite():IsFinished("Attack") then
                npc:GetSprite():Play("Hop", true)
            end
        end
    end

mod:AddPriorityCallback(ModCallbacks.MC_NPC_UPDATE, -1, mod.Maiden, one_hundred_and_nine)


function mod:Maiden2(npc)
    if npc.Variant == Maiden2 then
    local FRICTION = 0.8 -- 0.8 or 0.9 tends to work well
    local YOUR_SPEED = 6 
    local pos = npc.Position
    local data = npc:GetData()
    local params = ProjectileParams()
    local vec = Vector(10,0)
        if data.Maiden == true then
            npc:GetSprite():Play("Hop", true)
            data.Maiden = false
        end
        local target = npc:GetPlayerTarget()
        local rot = (target.Position - npc.Position):GetAngleDegrees()
        if npc:GetSprite():IsEventTriggered("Move") then
            runToTarget(npc, nil, YOUR_SPEED)
        end
        if npc:GetSprite():IsPlaying("Hop") and mod.IsPositionOnScreen(pos) then
            if npc:HasEntityFlags(EntityFlag.FLAG_FEAR) or npc:HasEntityFlags(EntityFlag.FLAG_CONFUSION) or npc:HasEntityFlags(EntityFlag.FLAG_FREEZE) then
                npc.StateFrame = npc.StateFrame
            else
                npc.StateFrame = npc.StateFrame + 1
            end
        end
        if npc:GetSprite():IsEventTriggered("Stop") then
            sound:Play(487, 1, 0, false, 1)
            npc.Velocity = Vector(0,0)
        end
            params.TargetPosition = pos
             --params.FallingAccelModifier = -0.2
             --params.ChangeFlags = ProjectileFlags.ACCELERATE_TO_POSITION
             --params.BulletFlags = ProjectileFlags.ACCELERATE_TO_POSITION 
            --params.ChangeVelocity = -20
            if npc:GetSprite():IsEventTriggered("Attack") then
                if not npc:HasEntityFlags(EntityFlag.FLAG_FEAR) or not npc:HasEntityFlags(EntityFlag.FLAG_CONFUSION) then
                    sound:Play(SoundEffect.SOUND_TEARS_FIRE, 1, 0, false, 1)
                    npc:FireProjectiles(pos, Vector(10,0):Rotated(rot), 0, params)
                end
            end
            if npc:GetSprite():IsEventTriggered("Attack2") then
                if not npc:HasEntityFlags(EntityFlag.FLAG_FEAR) or not npc:HasEntityFlags(EntityFlag.FLAG_CONFUSION) then
                    sound:Play(SoundEffect.SOUND_TEARS_FIRE, 1, 0, false, 1)
                        npc:FireProjectiles(pos, Vector(10,0):Rotated(rot), 0, params)
                end
            end
            if npc.StateFrame >= 60 and npc:GetSprite():GetFrame() == 19 and npc:GetSprite():IsPlaying("Hop") then
                npc.StateFrame = 0
                npc:GetSprite():Play("Attack", true)
                npc.Velocity = Vector(0,0)
            end
            if npc:GetSprite():IsFinished("Attack") then
                npc:GetSprite():Play("Hop", true)
            end
        end
    end

mod:AddPriorityCallback(ModCallbacks.MC_NPC_UPDATE, -1, mod.Maiden2, one_hundred_and_nine)
function mod:Maiden_Init(npc)
    if npc.Variant == Maiden or npc.Variant == Maiden2 then
        local data = npc:GetData()
        data.Maiden = true
        npc:AddEntityFlags(EntityFlag.FLAG_NO_SPIKE_DAMAGE | EntityFlag.FLAG_NO_PHYSICS_KNOCKBACK | EntityFlag.FLAG_NO_KNOCKBACK)
    end
end
mod:AddCallback(ModCallbacks.MC_POST_NPC_INIT, mod.Maiden_Init, one_hundred_and_nine)


function mod:Maiden_Unkillable(npc, big, chungus, DamageSource)
    if npc.Variant == Maiden or npc.Variant == Maiden2 then
        local frame = npc:GetSprite():GetFrame() 
        if not npc:GetSprite():IsPlaying("Attack") then
            return
        end
        if npc:GetSprite():IsPlaying("Attack")  then
            if frame < 9 then
                return
            end
            if frame > 33 then
                return
            end
        end
    end
end
      mod:AddCallback(ModCallbacks.MC_ENTITY_TAKE_DMG, mod.Maiden_Unkillable, one_hundred_and_nine)


      function mod:Blast(npc)
        if npc.Variant == Blastglob then
            if npc:HasEntityFlags(EntityFlag.FLAG_KNOCKED_BACK) then
                npc:ClearEntityFlags(EntityFlag.FLAG_KNOCKED_BACK)
                npc.Velocity = Vector.Zero
              end
            local globcount = countGloblins()
            local pos = npc.Position
            local data = npc:GetData()
            local params = ProjectileParams()
            local player = npc:GetPlayerTarget()
            local pos2 = player.Position
            local Rot = (player.Position - npc.Position):GetAngleDegrees()
            local dist = pos:Distance(player.Position)
            if data.Blaster == true then
                npc:GetSprite():Play("Idle", true)
                data.Blaster = false
            end
            if npc:GetSprite():IsPlaying("Idle") and mod.IsPositionOnScreen(pos) then
                if npc:HasEntityFlags(EntityFlag.FLAG_FEAR) or npc:HasEntityFlags(EntityFlag.FLAG_CONFUSION) or npc:HasEntityFlags(EntityFlag.FLAG_FREEZE) then
                else
                        if data.Cooldown == 0 then
                            npc:GetSprite():Play("Fire", true)
                            npc.Velocity = Vector(0,0)
                            data.Cooldown = 60
                        end
                end
            end
            if globcount > 2 then
                data.shoot = 1
            end
            data.Cooldown = data.Cooldown - 1
            if npc:GetSprite():IsFinished("Fire") then
                npc:GetSprite():Play("Idle", true)
                data.Cooldown = 60
            end
            --print(data.shoot)
            if npc:GetSprite():IsEventTriggered("Shoot") then
                if not npc:HasEntityFlags(EntityFlag.FLAG_FEAR) or not npc:HasEntityFlags(EntityFlag.FLAG_CONFUSION) then
                    sound:Play(SoundEffect.SOUND_MEATY_DEATHS, 1, 0, false, 1)
                    sound:Play(SoundEffect.SOUND_MONSTER_GRUNT_1, 1, 0, false, 1)
                    params.Variant = 0
                    local roll3 = rng:RandomInt(7)
                    --params.VelocityMulti = 0.5
                    
                    local vect = (player.Position - npc.Position)* 0.03
                    params.HeightModifier = -2
                    params.FallingAccelModifier = 2.2
                    params.FallingSpeedModifier = -60
                    params.Scale = 1.5
                    if data.shoot == 2 then
                        params.Variant = 11
                        params.Scale = 1
                        npc:FireProjectiles(pos, vect, 0, params)
                        data.shoot = 1
                    else
                        params.BulletFlags = ProjectileFlags.ACID_RED
                        npc:FireProjectiles(pos, vect, 0, params)
                        if globcount < 2 then
                        data.shoot = 2
                        end
                    end
                end
            end
            if npc:IsDead() then
                params.Variant = 11
                params.Scale = 1
                    params.FallingSpeedModifier = -20
                params.FallingAccelModifier = 1.5
                npc:FireBossProjectiles(1, pos, 1, params)
            end
        end
    end
        mod:AddPriorityCallback(ModCallbacks.MC_NPC_UPDATE, -1, mod.Blast,one_hundred_and_nine)


    function mod:Blastinit(npc)
        if npc.Variant == Blastglob then
            local data = npc:GetData()
            data.Cooldown = 60
            data.Blaster = true
            data.shoot = rng:RandomInt(2) + 1
            npc:GetSprite():Play("Idle", true)
            npc:AddEntityFlags(EntityFlag.FLAG_NO_PHYSICS_KNOCKBACK)
            npc:AddEntityFlags(EntityFlag.FLAG_NO_KNOCKBACK)
        end
    end
    
    
    mod:AddCallback(ModCallbacks.MC_POST_NPC_INIT, mod.Blastinit,one_hundred_and_nine)


    function mod:GlobHandler(projectile)
        if projectile.SpawnerType == nil and projectile.SpawnerVariant == nil or projectile.Type == nil then
            return
        end
        if projectile.SpawnerType == Blastglob then
            local glob = Isaac.CountEntities(nil, EntityType.ENTITY_GLOBIN, -1, -1)
            if glob >= 5 then
                return
            end
        end
    end
    
    mod:AddCallback(ModCallbacks.MC_POST_PROJECTILE_INIT, mod.GlobHandler)


    function mod:shoomshot(projectile)
        local pos = projectile.Position
        local data = projectile:GetData()
        local player = Isaac.GetPlayer(rng:RandomInt(game:GetNumPlayers()))
        if data.shroomshot == true then
            projectile.Velocity = lerpVector(projectile.Velocity, Vector(0,0) , 0.075)
            if projectile.ChangeTimeout > 0 then
                projectile.FallingAccel = -0.1            
                    projectile.FallingSpeed = 0
            end
            projectile.ChangeTimeout = projectile.ChangeTimeout - 1
            if projectile.ChangeTimeout <= 0 then
                projectile.FallingSpeed = projectile.FallingSpeed + 0.1
                --projectile.FallingAccel = projectile.FallingAccel + 0.1
            end
        end
    end
    mod:AddCallback(ModCallbacks.MC_POST_PROJECTILE_UPDATE, mod.shoomshot)

    function mod:shoomy(npc)
        if npc.Variant == Shroomy then
            if npc:HasEntityFlags(EntityFlag.FLAG_KNOCKED_BACK) then
                npc:ClearEntityFlags(EntityFlag.FLAG_KNOCKED_BACK)
                npc.Velocity = Vector.Zero
              end
            --print(npc.StateFrame)
            npc.Friction = 0
            npc.SplatColor = Color(1,1,1,1,0,0,0)
            local pos = npc.Position
            local data = npc:GetData()
            local params = ProjectileParams()
            local player = npc:GetPlayerTarget()
            local pos2 = player.Position
            local Rot = (player.Position - npc.Position):GetAngleDegrees()
        local dist = pos:Distance(player.Position)
            if data.shoomy == true then
                npc:GetSprite():Play("Shake", true)
                data.shoomy = false
            end
            if npc:GetSprite():IsPlaying("Shoot") then
                if npc:GetSprite():GetFrame() == 18 then
                sound:Play(SoundEffect.SOUND_TEARIMPACTS, 1, 0, false, 1)
                end
                npc.State = NpcState.STATE_ATTACK
            end
            if npc:GetSprite():IsPlaying("Shake") then
                npc.State = NpcState.STATE_IDLE
            end
            if player.Position.X > pos.X then
                npc.FlipX = false
            elseif player.Position.X <= pos.X then
                npc.FlipX = true
            end
            if npc:HasEntityFlags(EntityFlag.FLAG_FEAR) or npc:HasEntityFlags(EntityFlag.FLAG_CONFUSION) or npc:HasEntityFlags(EntityFlag.FLAG_FREEZE) then
                data.Cooldown = data.Cooldown
            else
                data.Cooldown = data.Cooldown - 1
            end
            if npc.State == NpcState.STATE_IDLE and mod.IsPositionOnScreen(pos) then
                if pos and player then
                    if dist <= 240 then
                        if npc:HasEntityFlags(EntityFlag.FLAG_FEAR) or npc:HasEntityFlags(EntityFlag.FLAG_CONFUSION) or npc:HasEntityFlags(EntityFlag.FLAG_FREEZE) then
                            elseif data.Cooldown <= 0 and room:CheckLine(pos, player.Position, 3, 0, true, false) then
                            npc:GetSprite():Play("Shoot", false)
                            npc.State = NpcState.STATE_ATTACK
                        end
                    end
                end
            end
            if npc:GetSprite():IsFinished("Shoot") then
                npc:GetSprite():Play("Shake", true)
                npc.State = NpcState.STATE_IDLE
                data.Cooldown = 45
            end
            if npc:IsDead() then
                effect = Isaac.Spawn(1000,205,0,pos,Vector(0,0),npc):ToEffect()
            end
            if npc:GetSprite():IsEventTriggered("Spore") then
                sound:Play(SoundEffect.SOUND_PLOP, 1, 0, false, 2)
                local roll = rng:RandomInt(360)
                local pos = npc.Position
                local params = ProjectileParams()
                local player = npc:GetPlayerTarget()
                local Rot = (player.Position - npc.Position):GetAngleDegrees()
                for i = 0, 2 do
                params.ChangeTimeout = 80 + (i * 10)
                params.BulletFlags =  ProjectileFlags.BOUNCE
                   params.Scale = 0.75 + (i * 0.5)
                   local projectiles = fireProjectiles(npc, pos, Vector(1 + (2.25 * (i + 1)),0):Rotated(Rot), 0, params)
                   local projectile = projectiles[1]
                   local data = projectile:GetData()
                   data.shroomshot = true
                   projectile.Height = -3
                end
            end
        end
    end
    mod:AddPriorityCallback(ModCallbacks.MC_NPC_UPDATE, -1, mod.shoomy, one_hundred_and_nine)







    function mod:shoomy2(npc)
        if npc.Variant == ShroomyWalk then
            npc.SplatColor = Color(1,1,1,1,0,0,0)
            local pos = npc.Position
            local data = npc:GetData()
            local params = ProjectileParams()
            local player = npc:GetPlayerTarget()
            local pos2 = player.Position
            local Rot = (player.Position - npc.Position):GetAngleDegrees()
            local dist = pos:Distance(player.Position)
            local YOUR_SPEED = 3
            if npc:GetSprite():IsPlaying("Shoot") then
                npc.Velocity = Vector(0,0)
            end
            if not npc:GetSprite():IsPlaying("Shoot") then
                runToTarget(npc, nil, YOUR_SPEED)
                npc:AnimWalkFrame("WalkHori", "WalkVert", 0.1)
                if npc:HasEntityFlags(EntityFlag.FLAG_FEAR) or npc:HasEntityFlags(EntityFlag.FLAG_CONFUSION) or npc:HasEntityFlags(EntityFlag.FLAG_FREEZE) then
                    data.Cooldown = data.Cooldown
                else
                    data.Cooldown = data.Cooldown - 1
                end
                if pos and player then
                    if mod.IsPositionOnScreen(pos) then
                        if dist <= 240 then
                            if npc:HasEntityFlags(EntityFlag.FLAG_FEAR) or npc:HasEntityFlags(EntityFlag.FLAG_CONFUSION) or npc:HasEntityFlags(EntityFlag.FLAG_FREEZE) then
                                elseif data.Cooldown <= 0 and room:CheckLine(pos,  player.Position, 3, 0, true, false) then
                                npc:GetSprite():Play("Shoot", false)
                                data.Cooldown = 45
                            end
                        end
                    end
                end
            end
            if npc:GetSprite():IsFinished("Shoot") then
                data.Cooldown = 45
                npc:GetSprite():Play("WalkVert", false)
            end
            if npc:IsDead() then
                effect = Isaac.Spawn(1000,205,0,pos,Vector(0,0),npc):ToEffect()
            end
            if npc:GetSprite():IsEventTriggered("Spore") then
                sound:Play(SoundEffect.SOUND_PLOP, 1, 0, false, 2)
                local roll = rng:RandomInt(360)
                local pos = npc.Position
                local params = ProjectileParams()
                local player = npc:GetPlayerTarget()
                local Rot = (player.Position - npc.Position):GetAngleDegrees()
                for i = 0, 2 do
                    params.ChangeTimeout = 80 + (i * 10)
                    params.BulletFlags =  ProjectileFlags.BOUNCE
                       params.Scale = 0.75 + (i * 0.5)
                       local projectiles = fireProjectiles(npc, pos, Vector(1 + (2.25 * (i + 1)),0):Rotated(Rot), 0, params)
                       local projectile = projectiles[1]
                       local data = projectile:GetData()
                       data.shroomshot = true
                       projectile.Height = -7
                end
            end
        end
    end
    mod:AddPriorityCallback(ModCallbacks.MC_NPC_UPDATE, -1, mod.shoomy2, one_hundred_and_nine)


    function mod:Taintedshoomy(npc)
        if npc.Variant == TaintedShroomy then
            if npc:HasEntityFlags(EntityFlag.FLAG_KNOCKED_BACK) then
                npc:ClearEntityFlags(EntityFlag.FLAG_KNOCKED_BACK)
                npc.Velocity = Vector.Zero
              end
            npc.SplatColor = Color(1,1,1,1,0,0,0)
            local pos = npc.Position
            local data = npc:GetData()
            local params = ProjectileParams()
            local player = npc:GetPlayerTarget()
            local pos2 = player.Position
            local Rot = (player.Position - npc.Position):GetAngleDegrees()
        local dist = pos:Distance(player.Position)
            if data.shoomy == true then
                npc:GetSprite():Play("Shake", true)
                data.shoomy = false
            end
         --   if Entity.SpawnerEntity.SpawnerEntity == this then
          --  end
            if npc:GetSprite():IsPlaying("Shoot") then
                if npc:GetSprite():GetFrame() == 18 then
                sound:Play(SoundEffect.SOUND_TEARIMPACTS, 1, 0, false, 1)
                end
                npc.State = NpcState.STATE_ATTACK
            end
            if npc:GetSprite():IsPlaying("Shake") then
                npc.State = NpcState.STATE_IDLE
            end
            if player.Position.X > pos.X then
                npc.FlipX = false
            elseif player.Position.X <= pos.X then
                npc.FlipX = true
            end
            if npc:HasEntityFlags(EntityFlag.FLAG_FEAR) or npc:HasEntityFlags(EntityFlag.FLAG_CONFUSION) or npc:HasEntityFlags(EntityFlag.FLAG_FREEZE) then
                data.Cooldown = data.Cooldown
            else
                data.Cooldown = data.Cooldown - 1
            end
            if npc:GetSprite():IsPlaying("Shoot") then
                if npc:GetSprite():GetFrame() == 18 then
                sound:Play(SoundEffect.SOUND_TEARIMPACTS, 1, 0, false, 1)
                end
                npc.State = NpcState.STATE_ATTACK
            end
            if npc:GetSprite():IsPlaying("Shake") then
                npc.State = NpcState.STATE_IDLE
            end
            if player.Position.X > pos.X then
                npc.FlipX = false
            elseif player.Position.X <= pos.X then
                npc.FlipX = true
            end
            if npc.State == NpcState.STATE_IDLE and mod.IsPositionOnScreen(pos) then
                if pos and player then
                    if dist <= 320 then
                        if npc:HasEntityFlags(EntityFlag.FLAG_FEAR) or npc:HasEntityFlags(EntityFlag.FLAG_CONFUSION) or npc:HasEntityFlags(EntityFlag.FLAG_FREEZE) then
                        elseif data.Cooldown <= 0 and room:CheckLine(pos, player.Position, 3, 0, true, false) then
                            npc:GetSprite():Play("Shoot", false)
                            npc.State = NpcState.STATE_ATTACK
                        end
                    end
                end
            end
            if npc:GetSprite():IsFinished("Shoot") then
                npc:GetSprite():Play("Shake", true)
                npc.State = NpcState.STATE_IDLE
                data.Cooldown = 45
            end
            if npc:IsDead() then
                effect = Isaac.Spawn(1000,205,0,pos,Vector(0,0),npc):ToEffect()
            end
            local spores = Isaac.CountEntities(npc, 328, -1, -1)
            if npc:GetSprite():IsEventTriggered("Spore") then
                --print(spores)
                sound:Play(SoundEffect.SOUND_PLOP, 1, 0, false, 0.5)
                local roll = rng:RandomInt(360)
                local pos = npc.Position
                local params = ProjectileParams()
                local player = npc:GetPlayerTarget()
                local Rot = (player.Position - npc.Position):GetAngleDegrees()
                if spores <= 6 then
                local projectile = npc:FireBossProjectiles(3, player.Position, 5, params):ToProjectile()
                end

                for i = 0, 3 do
                effect = Isaac.Spawn(1000,141,0,pos + Vector(160-(i*40),0):Rotated(Rot),Vector(0,0),npc):ToEffect()
                effect:SetTimeout(150 - (i* 10))
                if i == 3 then
                    effect:GetSprite().Scale = Vector(0.5,0.5)
                end
                if i == 2 then
                    effect:GetSprite().Scale = Vector(0.65,0.65)
                end
                if i == 1 then
                    effect:GetSprite().Scale = Vector(0.8,0.8)
                end
                if i == 0 then
                    effect:GetSprite().Scale = Vector(1,1)
                end
                effect:GetSprite().Offset = Vector(0,-0.1)
                end


                for i = 0, 2 do
                    effect = Isaac.Spawn(1000,141,0,pos + Vector(120-(i*40),0):Rotated(Rot - 40),Vector(0,0),npc):ToEffect()
                    effect:SetTimeout(120 - (i* 10))
                    if i == 2 then
                        effect:GetSprite().Scale = Vector(0.5,0.5)
                    end
                    if i == 1 then
                        effect:GetSprite().Scale = Vector(0.6,0.6)
                    end
                    if i == 0 then
                        effect:GetSprite().Scale = Vector(0.7,0.7)
                    end
                    effect:GetSprite().Offset = Vector(0,-0.1)
                end
                for i = 0, 2 do
                    effect = Isaac.Spawn(1000,141,0,pos + Vector(120-(i*40),0):Rotated(Rot+ 40),Vector(0,0),npc):ToEffect()
                    effect:SetTimeout(120 - (i* 10))
                    if i == 2 then
                        effect:GetSprite().Scale = Vector(0.5,0.5)
                    end
                    if i == 1 then
                        effect:GetSprite().Scale = Vector(0.6,0.6)
                    end
                    if i == 0 then
                        effect:GetSprite().Scale = Vector(0.7,0.7)
                    end
                    effect:GetSprite().Offset = Vector(0,-0.1)
                end
            end
        end
    end
    mod:AddPriorityCallback(ModCallbacks.MC_NPC_UPDATE, -1, mod.Taintedshoomy, one_hundred_and_nine)

    function mod:TaintedshoomySpore(projectile)
        if not projectile.SpawnerEntity then
            return
        end
        local npc = projectile.SpawnerEntity:ToNPC()
        if not npc then
            return
        end
        if npc.Type == one_hundred_and_nine and npc.Variant == TaintedShroomy then
            --print(projectile.Height)
            if projectile.Height >= -5 and projectile:CollidesWithGrid() == false then
                Isaac.Spawn(one_hundred_and_nine,7,0,projectile.Position,Vector(0,0),npc)
                projectile:Remove()
            end
        end
    end
    mod:AddCallback(ModCallbacks.MC_POST_PROJECTILE_UPDATE, mod.TaintedshoomySpore)

    function mod:shoomyeffect(effect)
        if effect.Type == 1000 and effect.Variant == 205 then
            if effect:GetSprite():IsFinished("Death") then
                effect:Remove()
            end
        end
    end
    mod:AddCallback(ModCallbacks.MC_POST_EFFECT_INIT, mod.shoomyeffect)



    function mod:shoomyeffectint(effect)
        if effect.Type == 1000 and effect.Variant == 205 then
        effect:GetSprite():Play("Death", true)
        end
    end
    mod:AddCallback(ModCallbacks.MC_POST_EFFECT_INIT, mod.shoomyeffectint)
    function mod:shoomyinit(npc)
        if npc.Variant == Shroomy or npc.Variant == TaintedShroomy then
            local data = npc:GetData()
            data.Cooldown = 45
            data.shoomy = true
            npc:GetSprite():Play("Idle", true)
            npc:AddEntityFlags(EntityFlag.FLAG_NO_PHYSICS_KNOCKBACK)
            npc:AddEntityFlags(EntityFlag.FLAG_NO_KNOCKBACK)
        end
        if npc.Variant == ShroomyWalk then
            local data = npc:GetData()
            data.Cooldown = 45
        end
    end
    
    
    mod:AddCallback(ModCallbacks.MC_POST_NPC_INIT, mod.shoomyinit,one_hundred_and_nine)




    function mod:shoomy2init(npc)
        if npc.Variant == AgedBoney then
            local data = npc:GetData()
            data.place = Isaac:GetRandomPosition()
            data.Direction = ""
            data.enrage = 0
            data.Speed = 0.65
        end
    end
    mod:AddCallback(ModCallbacks.MC_POST_NPC_INIT, mod.shoomy2init, one_hundred_and_nine)


    function mod:agedboned(npc)
        if npc.Variant == AgedBoney then
            npc.SplatColor = Color(1,1,1,1,0,0,0)
            local pos = npc.Position
            local data = npc:GetData()
            local player = npc:GetPlayerTarget()
            local pos2 = player.Position
            local Rot = (player.Position - npc.Position):GetAngleDegrees()
            local dist = pos:Distance(player.Position)
            local angle = npc.Velocity:GetAngleDegrees()
            local YOUR_SPEED = 3
            if npc:GetSprite():IsPlaying("Shoot") then
                npc.Velocity = Vector(0,0)
            end
            if npc.Position:Distance(data.place) < 2 or npc.Velocity:Length() < 1 or not npc.Pathfinder:HasPathToPos(data.place, false) then
                data.place = Isaac:GetRandomPosition()
            end
            npc.Pathfinder:FindGridPath(data.place, data.Speed, 500, false)
            npc.Pathfinder:UpdateGridIndex()
            local angleDegrees = npc.Velocity:GetAngleDegrees()
            if angleDegrees > -45 and angleDegrees < 45 then
                data.Direction = "Right"
            elseif angleDegrees >= 45 and angleDegrees <= 135 then
                data.Direction = "Down"
            elseif angleDegrees < -45 and angleDegrees > -135 then
                data.Direction = "Up"
            else
                data.Direction = "Left"
            end

            if npc:GetSprite():IsOverlayPlaying("HeadLaugh" .. data.Direction) then
                data.Speed = 0.9
            else
                data.Speed = 0.65
            end
            if npc.Velocity:Length() > 0.1 then
                if not npc:GetSprite():IsPlaying("Walk" .. data.Direction) then
                    npc:GetSprite():Play("Walk" .. data.Direction, true)
                    if data.enrage == 0 then 
                        npc:GetSprite():PlayOverlay("Head" .. data.Direction, false)
                    elseif data.enrage == 1 then
                        npc:GetSprite():PlayOverlay("HeadLaugh" .. data.Direction, false)
                    end
                end
            else
                npc:GetSprite():SetFrame("WalkDown", 0)
                npc:GetSprite():SetOverlayFrame("HeadDown", 0)
            end
        end
    end
    mod:AddPriorityCallback(ModCallbacks.MC_NPC_UPDATE, -1, mod.agedboned,one_hundred_and_nine)


local catchMiniboss = false
local returnIndex

local holyoneRooms = StageAPI.RoomsList("the holy one", include("resources.luarooms.holy one miniboss room"))
local camilloRooms = StageAPI.RoomsList("camillo", include("resources.luarooms.cammilo miniboss room"))

function mod.GetExpectedMinibossDisplayFlags()
	local level = game:GetLevel()
	local flags = RoomDescriptor.DISPLAY_NONE

	if level:GetStateFlag(LevelStateFlag.STATE_MAP_EFFECT) then flags = RoomDescriptor.DISPLAY_BOX end
	if level:GetStateFlag(LevelStateFlag.STATE_COMPASS_EFFECT) then flags = RoomDescriptor.DISPLAY_ALL end
	if level:GetStateFlag(LevelStateFlag.STATE_FULL_MAP_EFFECT) then flags = RoomDescriptor.DISPLAY_ALL end

	return flags
end

local function IsRoomDeadEnd(index)
	local level = game:GetLevel()
	local connections = 0

	for _, shift in pairs({1, -1, 13, -13}) do
		local desc = level:GetRoomByIdx(index + shift)
		if desc.Data and desc.Data.Type ~= RoomType.ROOM_SECRET then
			connections = connections + 1
		end
	end

	return connections == 1
end

local function GetRoomToOverridecp(rng)
	local level = game:GetLevel()
	local roomsList = level:GetRooms()

	local minibossIndex
	local deadEndIndexes = {}

	for i = 0, #roomsList - 1 do
		local desc = roomsList:Get(i)
		if desc.Data.Type == RoomType.ROOM_MINIBOSS then
			minibossIndex = desc.SafeGridIndex
			break
		elseif desc.Data.Shape == RoomShape.ROOMSHAPE_1x1 and desc.Data.Type == RoomType.ROOM_DEFAULT then
			if IsRoomDeadEnd(desc.SafeGridIndex) then
				table.insert(deadEndIndexes, desc.SafeGridIndex)
			end
		end
	end

	if minibossIndex then
		return minibossIndex
	else
		return deadEndIndexes[rng:RandomInt(#deadEndIndexes) + 1]
	end
end

local function MakeChapter5MinibossCp(roomsList, rng)
	local rng = rng or RNG()
	local level = game:GetLevel()
	local toOverride = GetRoomToOverridecp(rng)
	local overwriteDesc = level:GetRoomByIdx(toOverride)
	local newData = StageAPI.GetGotoDataForTypeShape(RoomType.ROOM_MINIBOSS, RoomShape.ROOMSHAPE_1x1)

	overwriteDesc.Data = newData
	overwriteDesc.DisplayFlags = (overwriteDesc.DisplayFlags & ~ overwriteDesc.DisplayFlags) | mod.GetExpectedMinibossDisplayFlags()
	overwriteDesc.SurpriseMiniboss = overwriteDesc.SurpriseMiniboss or not overwriteDesc.SurpriseMiniboss
	overwriteDesc.Flags = overwriteDesc.Flags & ~ overwriteDesc.Flags

	local minibossRoom = StageAPI.LevelRoom{
		RoomType = RoomType.ROOM_DEFAULT,
		RequireRoomType = false,
		RoomsList = roomsList,
		RoomDescriptor = overwriteDesc
	}
	StageAPI.SetLevelRoom(minibossRoom, overwriteDesc.ListIndex)

	level:UpdateVisibility()
end

mod:AddCallback(ModCallbacks.MC_POST_NEW_LEVEL, function()
	local level = game:GetLevel()
    if not FiendFolio then
        if level:GetStage() == LevelStage.STAGE5 and not BasementRenovator then
            if level:GetStageType() == StageType.STAGETYPE_WOTL then
                MakeChapter5MinibossCp(holyoneRooms, rng)
            else
                MakeChapter5MinibossCp(camilloRooms, rng)
            end
        end
    end
    if FiendFolio then
        local chance = rng:RandomInt(2)
        if chance == 1 then
            --print("The mini boss for this floor will be from Crab Pack")
            if level:GetStage() == LevelStage.STAGE5 and not BasementRenovator then
                if level:GetStageType() == StageType.STAGETYPE_WOTL then
                    MakeChapter5MinibossCp(holyoneRooms, rng)
                else
                    MakeChapter5MinibossCp(camilloRooms, rng)
                end
            end
        end
        if chance == 0 then
            --print("The mini boss for this floor will be from Fiend Folio!")
        end
    end
end)

mod:AddCallback(ModCallbacks.MC_POST_NEW_ROOM, function()
	local room = game:GetRoom()
	if room:GetType() == RoomType.ROOM_MINIBOSS then
		if Isaac.CountEntities(nil,one_hundred_and_nine, Holl) > 0 then
			local hud = game:GetHUD()
			hud:ShowItemText(Isaac.GetPlayer():GetName() .. " vs the holy one", "", false)
		elseif Isaac.CountEntities(nil,one_hundred_and_nine, Camilloa) > 0 then
			local hud = game:GetHUD()
			hud:ShowItemText(Isaac.GetPlayer():GetName() .. " vs camillo", "", false)
		end
	end
end)

