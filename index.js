const fs = require("fs");
const { randomInt } = require("crypto");
const prompt = require("prompt");

treasure_num = 0;
map_data = [];
pos_user = [];
pos_road = [];
pos_treasure = [];
option = {
  1: "Print Map",
  2: "Print Map with treasure",
  3: "Re-position of Treasure",
  4: "Play Time!",
};
// console.log(option)
maps = fs.readFileSync("map.txt", "utf8");
maps.split("\n").map((x) => {
  mapped = [];
  x.split("\n").map((y) => {
    mapped.push(y);
  });
  map_data.push(mapped);
});

const run_hunt = (treasure_num = 1) => {
  treasure_num = treasure_num;
  run_coordinate();
  run_treasure(treasure_num);
  pick_option();
};

const pick_option = () => {
  prompt.start();
  console.log(option);
  prompt.get(["Option"], function (err, result) {
    if (err) {
      return onErr(err);
    }
    if (result.Option === "1") {
      print_maps((treasure = false));
    } else if (result.Option === "2") {
      print_maps((treasure = true));
    } else if (result.Option === "3") {
      input_treasure();
    } else if (result.Option === "4") {
      play_game();
    }
  });
};

const arr = (data) => {
  return Array.from(Array(data).keys());
};

const play_game = () => {
  print_maps((treasure = false), (clear = false));
  print_maps((treasure = true), (clear = false));
  console.log("Treasure position : " + pos_treasure.toString());

  posX = pos_user[0][0];
  posY = pos_user[0][1];

  moving = [];
  moving.push(["up/north", "UP", false]);
  moving.push(["right/east", "RIGHT", true]);
  moving.push(["down/south", "DOWN", true]);
  result = [];

  moving.map((m) => {
    result = updateCoordinate(posX, posY, m[0], m[1], m[2]);

    if (result) {
      posX = result[0];
      posY = result[1];
    }

    if (result && result === pos_treasure) {
      console.log("Congratulations, You found the treasure...");
    } else if (result) {
      console.log("Is just ordinary road...");
    } else {
      console.log("Is seems blocked...");
    }
  });
};

const updateCoordinate = (
  posX,
  posY,
  pos_text = "up/north",
  pos = "UP",
  ignore_wall = True
) => {
  posCombine = [posX, posY];
  possible_count =
    "0-" +
    toString(
      countCoordinate(posCombine, (pos = pos), (ignore_wall = ignore_wall))
    );
  moving = console.log(pos_text + " (" + possible_count + "):");

  is_blocked = isRoute(posCombine, parseInt(moving), pos);

  if (is_blocked) {
    return None;
  }

  add = parseInt(moving);

  if (pos === "UP") {
    posX -= add;
  } else if (pos === "RIGHT") {
    posY += add;
  } else if (pos === "DOWN") {
    posX += add;
  }

  return [posX, posY];
};

const isRoute = (coordinate, move, pos = "UP") => {
  posX = coordinate[0];
  posY = coordinate[1];

  arr(move + 1).map((m) => {
    if (pos == "UP") {
      posX = coordinate[0] - add;
    } else if (pos == "RIGHT") {
      posY = coordinate[1] + add;
    } else if (pos == "DOWN") {
      posX = coordinate[0] + add;
    }

    if (
      posX < 0 ||
      posX > length(map_data) ||
      posY < 0 ||
      posY > length(map_data[0])
    )
      return true;

    if (map_data[posX][posY] === "#") return true;
  });

  return false;
};

const countCoordinate = (coordinate, pos = "UP", ignore_wall = true) => {
  found = 0;
  move = 1;
  posX = 0;
  posY = 0;

  while (move) {
    if (pos === "UP") {
      posX = coordinate[0] - move;
      posY = coordinate[1];
    }
    if (pos == "RIGHT") {
      posX = coordinate[0];
      posY = coordinate[1] + move;
    }
    if (pos == "DOWN") {
      posX = coordinate[0] + move;
      posY = coordinate[1];
    }

    // if position is negative of more than length of array then break
    if (
      posX < 0 ||
      posY < 0 ||
      posX >= map_data.length ||
      posY >= map_data[0].length
    )
      if (ignore_wall) {
        move -= 3;
      }

    // if target position is not possible road then break
    if (ignore_wall) {
      if (
        map_data[posX][posY] === "." ||
        map_data[posX][posY] === "$" ||
        map_data[posX][posY] === "#"
      ) {
        found += 1;
      }
    } else if (map_data[posX][posY] === "#") {
    } else if (map_data[posX][posY] === "." || map_data[posX][posY] === "$") {
      found += 1;
    }
    move += 1;
  }

  return found;
};

const print_maps = (treasure = false, clear = true) => {
  if (treasure) {
    console.log(">> Map With Treasure <<");
  } else {
    console.log(">> Map <<");
  }

  arr(map_data.length).map((row) => {
    output = "";
    arr(map_data[0].length).map((column) => {
      if (treasure && [row, column] === pos_treasure) {
        output += "$";
      } else {
        output += map_data[row][column];
      }
    });
    console.log(output);
  });
};

const run_coordinate = () => {
  // get set of position of user and possible road
  arr(map_data.length).map((row) => {
    arr(map_data[row].length).map((column) => {
      if (map_data[row][column] === "X") {
        pos_user.push([row, column]);
      } else if (map_data[row][column] === ".") {
        pos_road.push([row, column]);
      }
    });
  });
  //check if position user is not found then generate randomly for 1 user
  if (pos_user.length === 0) {
    posT = Math.random(0, pos_road.length - 1);
    pX = pos_road[(posT, 0)];
    pY = pos_road[(posT, 1)];
    map_data[(pX, pY)] = "X";
    pos_user.push([pX], [pY]);
  }
  //if more than 1 user then discard other user and kept first user
  if (pos_user.length > 1) {
    temp_posT = [];
    temp_posT.push(pos_user[0]);
    arr(pos_user.length).map((m) => {
      pX = pos_road[(m, 0)];
      pY = pos_road[(m, 1)];
      map_data[pX][pY] = ".";
      pos_user.push([pX], [pY]);
    });
    pos_user = temp_posT;
  }
};

const run_treasure = (num) => {
  if (num > pos_road.length) {
    num = pos_road.length;
  }

  while (pos_treasure.length !== num) {
    posT = randomInt(0, length(pos_road) - 1);
    if (posT !== pos_treasure) {
      pos_treasure.push(pos_road[posT]);
    }
  }
};

const input_treasure = () => {
  prompt.start();
  pos_treasure = [];
  prompt.get(["treasure"], function (err, result) {
    if (err) {
      return onErr(err);
    }

    if (result.treasure !== "") {
      treasure_num = parseInt(result.treasure);
    }
    run_treasure(treasure_num);
    print_maps((treasure = true), (clear = false));
  });
};

run_hunt();
