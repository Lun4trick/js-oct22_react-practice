import React, { useEffect, useState } from 'react';
import './App.scss';
import cn from 'classnames';

import usersFromServer from './api/users';
import productsFromServer from './api/products';
import categoriesFromServer from './api/categories';

const getCategory = (categoryIdProduct: number) => (
  categoriesFromServer.find(category => categoryIdProduct === category.id)
);

const getUser = (ownerId: number | undefined) => (
  usersFromServer.find((user) => user.id === ownerId)
);

const productsWithAllInfo = productsFromServer.map(product => (
  {
    ...product,
    category: getCategory(product.categoryId),
    owner: getUser(getCategory(product.categoryId)?.ownerId),
  }));

export const App: React.FC = () => {
  const [currentProducts, setCurrentProducts] = useState(productsWithAllInfo);
  const [selectedUser, setSelectedUser] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [currentSearch, setCurrentSearch] = useState('');

  const filterProducts = () => {
    let result = productsWithAllInfo
      .filter(product => (
        product.name.toLocaleLowerCase().includes(currentSearch.toLowerCase())
      ));

    if (selectedCategory) {
      result = result
        .filter(product => product.categoryId === selectedCategory);
    }

    if (selectedUser) {
      result = result
        .filter(product => product.category?.ownerId === selectedUser);
    }

    return result;
  };

  const resetHandler = () => {
    setSelectedUser(0);
    setSelectedCategory(0);
    setCurrentSearch('');
  };

  useEffect(() => {
    setCurrentProducts(filterProducts());
  }, [selectedCategory, selectedUser, currentSearch]);

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                className={cn({ 'is-active': !selectedUser })}
                onClick={() => setSelectedUser(0)}
                data-cy="FilterAllUsers"
                href="#/"
              >
                All
              </a>

              {usersFromServer.map((user) => (
                <a
                  className={cn({
                    'is-active': selectedUser === user.id,
                  })}
                  data-cy="FilterUser"
                  key={user.id}
                  onClick={() => setSelectedUser(user.id)}
                  href="#/"
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={currentSearch}
                  onChange={(event) => setCurrentSearch(event.target.value)}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {currentSearch && (
                  <span className="icon is-right">
                    {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={() => setCurrentSearch('')}
                    />
                  </span>
                )}
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className="button is-success mr-6 is-outlined"
                onClick={() => setSelectedCategory(0)}
              >
                All
              </a>

              {categoriesFromServer.map(category => (
                <a
                  data-cy="Category"
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={cn(
                    'button mr-2 my-1',
                    { 'is-info': selectedCategory === category.id },
                  )}
                  href="#/"
                >
                  {category.title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={resetHandler}

              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          { !currentProducts.length && (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          )}

          <table
            data-cy="ProductTable"
            className="table is-striped is-narrow is-fullwidth"
          >
            <thead>
              <tr>
                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    ID

                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    Product

                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort-down" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    Category

                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort-up" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    User

                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort" />
                      </span>
                    </a>
                  </span>
                </th>
              </tr>
            </thead>

            <tbody>

              {currentProducts.map((product) => (
                <tr data-cy="Product">
                  <td className="has-text-weight-bold" data-cy={product.id}>
                    {product.id}
                  </td>

                  <td data-cy="ProductName">{product.name}</td>
                  <td data-cy="ProductCategory">
                    {`${getCategory(product.categoryId)?.icon} - ${getCategory(product.categoryId)?.title}`}
                  </td>

                  <td
                    data-cy="ProductUser"
                    className={
                      (getUser(
                        getCategory(product.categoryId)?.ownerId,
                      )?.sex) === 'm'
                        ? 'has-text-link'
                        : 'has-text-danger'
                    }
                  >
                    {getUser(
                      getCategory(product.categoryId)?.ownerId,
                    )?.name}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
