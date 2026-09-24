import test from 'node:test';
import assert from 'node:assert/strict';
import { story, getNode, newGame, resolveChoice } from '../src/story.js';

const careers = ['doctor', 'founder', 'astronaut'];
const forms = new Set(['childhood','school','university','beijing','meeting','together','chengdu','birthday']);
const scenes = new Set(['village','school','campus','lab','home','garden','station','date','park','engagement','sea','space','dream','market','harbin','birthday','graduation','cake']);

test('all 2187 lives keep their chosen route and reach the shared birthday', () => {
  let endings = 0;
  const visited = new Set();
  const totals = { doctor: 0, founder: 0, astronaut: 0 };
  function walk(state, path = []) {
    assert.ok(path.length < 40, 'a route must not loop or get stuck');
    if (state.node === 'ending') {
      for (const anchor of ['firstdate', 'engagement', 'arrival', 'candles'])
        assert.ok(path.includes(anchor), `missing ${anchor}`);
      for (const step of ['teen','work','breakthrough','crisis','turning','meeting','future','packing'])
        assert.ok(path.includes(`${state.career}_${step}`), `missing actual ${state.career} scene: ${step}`);
      assert.equal(state.choices.length, 7);
      assert.equal(state.items.length, 7);
      totals[state.career]++;
      endings++;
      return;
    }
    const node = getNode(state);
    assert.ok(node, `missing destination ${state.node}`);
    assert.ok(scenes.has(node.scene), `unknown scene ${node.scene}`);
    if (node.form) assert.ok(forms.has(node.form), `unknown actor ${node.form}`);
    assert.ok(node.text && node.title);
    if (state.career) {
      for (const other of careers.filter(career => career !== state.career))
        assert.ok(!state.node.startsWith(`${other}_`), `forced from ${state.career} into ${other}`);
      if (state.career !== 'doctor')
        assert.doesNotMatch(node.text, /解放军医学院|认真备考|继续学医|读博|博士生|毕设/,
          `nonmedical life forced back to medicine at ${state.node}`);
    }
    visited.add(state.node);
    const nextPath = [...path, state.node];
    if (node.choices) {
      assert.equal(node.choices.length, 3);
      node.choices.forEach((choice, index) => {
        assert.ok(choice.result && choice.item && choice.next);
        const next = { ...resolveChoice(state, node, index), result: null };
        if (state.career) assert.equal(next.career, state.career);
        walk(next, nextPath);
      });
    } else walk({ ...state, node: node.next }, nextPath);
  }
  walk(newGame());
  assert.equal(endings, 2187);
  assert.deepEqual(totals, { doctor: 729, founder: 729, astronaut: 729 });
  assert.equal(visited.size, Object.keys(story).length, 'authored scenes must be reachable');
});

for (const career of careers) {
  test(`${career}: childhood, project and later choices change future scenes`, () => {
    const snapshot = (node, state) => getNode({ ...newGame(), career, node, ...state });
    // The same adult project has different events because of a much earlier childhood choice.
    const origins = [0, 1, 2].map(origin => snapshot(`${career}_breakthrough`, { origin }));
    assert.equal(new Set(origins.map(node => node.text)).size, 3);
    assert.match(origins[0].text, /徽章|会长|动物/);
    assert.match(origins[1].text, /杏树|树枝|树梢|那枝勇气/);
    assert.match(origins[2].text, /草/);
    const projects = [0, 1, 2].map(project => snapshot(`${career}_breakthrough`, { project }));
    assert.equal(new Set(projects.map(node => node.title + node.text)).size, 3);
    const approaches = [0, 1, 2].map(approach => snapshot(`${career}_turning`, { approach }));
    assert.equal(new Set(approaches.map(node => node.text)).size, 3);
    const ambitions = [0, 1, 2].map(ambition => snapshot(`${career}_packing`, { ambition }));
    assert.equal(new Set(ambitions.map(node => node.text)).size, 3);
    const meeting = snapshot(`${career}_meeting`, {});
    assert.equal(new Set(meeting.choices.map(choice => choice.result)).size, 3);
    for (let index = 0; index < 3; index++) {
      const met = resolveChoice({ ...newGame(), career }, meeting, index);
      assert.equal(met.node, 'firstdate');
      assert.match(meeting.text + met.result.text, /尹航/);
    }
  });
}

test('shared couple memories reflect the activity chosen together', () => {
  const cakes = [0, 1, 2].map(partnerActivity =>
    getNode({ ...newGame(), node: 'fruitcake', partnerActivity }).text);
  assert.equal(new Set(cakes).size, 3);
  assert.match(cakes[0], /清单/);
  assert.match(cakes[1], /设计图/);
  assert.match(cakes[2], /补给箱/);
});

test('choosing a life is independent of childhood, and restart resets both', () => {
  for (let origin = 0; origin < 3; origin++) {
    const child = resolveChoice(newGame(), getNode(newGame()), origin);
    const crossroads = getNode({ ...child, node: 'crossroads' });
    crossroads.choices.forEach((_, index) => {
      const life = resolveChoice(child, crossroads, index);
      assert.equal(life.career, careers[index]);
      assert.equal(life.origin, origin);
      assert.equal(life.node, `${careers[index]}_teen`);
    });
  }
  assert.equal(newGame().career, null);
  assert.equal(newGame().origin, 0);
  assert.deepEqual(newGame().items, []);
});

test('space rescue uses the equipment that was actually invented', () => {
  const expected = [/花手/, /杏树/, /好梦号/];
  for (let project = 0; project < 3; project++) {
    const node = getNode({ ...newGame(), career: 'astronaut', node: 'astronaut_meeting', project });
    assert.match(node.choices[0].label, expected[project]);
    assert.match(node.choices[0].item, project === 0 ? /失重/ : expected[project]);
    assert.match(node.choices[1].label, /安全绳/);
    assert.match(node.choices[2].label, /借.*小推车/);
  }
});
